const postApproveService = require('../../modules/bigdata/services/ai/creativePoster/postApproveService');
const fbPageService = require('../../modules/bigdata/services/ai/creativePoster/fbPageService');
const fbGraphAPIService = require('../../modules/bigdata/services/facebook/graphAPIService');
const notificationService = require('../../modules/core/services/notificationService');
const facebookGraphConfigs = require('../../configs/facebookGraph');
const shortLinkConfigs = require('../../configs/shortLink');
const shortLinkService = require('../../modules/bizfly/services/shortLinkService');
const moment = require("moment");

const start = async () => {
    const shortLinkTokenDefault = shortLinkConfigs.token.default;
    const currentTimestamp = moment().unix();
    // get all approved posts
    const args = {
        offset: 0,
        limit: 100,
        flag: 0,
        approve: 1,
        fromPublishDate: moment().format('YYYY-MM-DD'),
        toPublishDate: moment().format('YYYY-MM-DD')
    };
    const postData = await postApproveService.search(args);

    const posts = postData.results.posters;
    if (posts.length == 0) {
        return false;
    }

    const pageIds = [];
    posts.forEach(e => {
        if (pageIds.indexOf(e.pageId) < 0) {
            pageIds.push(e.pageId);
        }
    });
    if (pageIds.length == 0) {
        return false;
    }

    // get pages access token
    const pageAccessTokens = [];
    for (const pageId of pageIds) {
         const pageAccessTokenResult = await fbPageService.getToken(pageId);
        const pageResult = await fbPageService.getById(pageId);
        pageAccessTokens.push({
            pageId: pageId,
            name: pageResult.results.page.name,
            facebookPageId: pageResult.results.page.facebookPageId,
            accessToken: pageAccessTokenResult.results.accessToken
        })
    }

    const schedulePosts = posts.filter(e => e.schedulePublishTime && e.schedulePublishTime !== -1 && (e.publishTime === -1 || e.publishTime === null));
    const notSchedulePosts = posts.filter(e => e.schedulePublishTime && e.schedulePublishTime == -1 && e.publishTime === -1 || e.publishTime === null);

    schedulePosts.forEach((post) => {
        if (currentTimestamp >= post.schedulePublishTime) {
            notSchedulePosts.push(post);
        }
    });

    // process notSchedulePosts
    for (const i in notSchedulePosts) {
        const post = notSchedulePosts[i];
        const comment = post.comment;
        const fbPage = pageAccessTokens.find(e => e.pageId === post.pageId);
        if (typeof fbPage === 'undefined' || post.publishTime !== -1 || !post.url) {
            continue;
        }

        // post photo to facebook
        const fbPostResult = await fbGraphAPIService.page.post.photo({
            pageId: fbPage.facebookPageId, accessToken: fbPage.accessToken, caption: post.status, imageUrl: post.image
        });
        if (fbPostResult.status === 0) {
            // console.log(`Error: ${fbPostResult.message}`);
            let message = `- Domain: ${post.domain}
- Post Id: ${post.postId}
- Fan Page: ${fbPage.name}
- Lỗi: ${fbPostResult.message}
- Trạng thái: Lỗi`;
            await notificationService.send(message, {
                appName: 'AI - Creative Poster - Auto Post Facebook',
                enable: facebookGraphConfigs.telegramBot.enable,
                token: facebookGraphConfigs.telegramBot.token,
                chatId: facebookGraphConfigs.telegramBot.chatId
            });
            continue;
        }
        const facebookPostId = fbPostResult.results.postId || false;

        // create short link
        const shortLinkToken = typeof shortLinkConfigs.token[post.domain.toLowerCase()] !== 'undefined' ? shortLinkConfigs.token[post.domain.toLowerCase()] : shortLinkTokenDefault;
        const shortLinkResult = await shortLinkService.create({
            url: post.url,
            alias: '',
            token: shortLinkToken
        })

        // post comment to facebook
        const postUrl = shortLinkResult && shortLinkResult.code === 200 ? shortLinkResult.results.short : post.url;
        const commentContent = comment ? comment + `\n${postUrl}` : `Chi tiết\n${postUrl}`;
        const fbCommentResult = await fbGraphAPIService.page.post.comment({
            postId: facebookPostId, accessToken: fbPage.accessToken, message: commentContent
        });
        if (fbCommentResult.status === 0) {
            console.log(`Error: ${fbCommentResult.message}`);
            continue;
        }

        const facebookCommentId = fbCommentResult.results.commentId || false;

        // update publish time
        const postApprovePublishResult = await postApproveService.publish({
            postId: post.postId, pageId: post.pageId, facebookPostId: fbPostResult.results.fbPostId, facebookCommentId: facebookCommentId
        });
        // console.log(post, postApprovePublishResult);

        const fbPostLinkResult = await fbGraphAPIService.post.getLink({
            postId: fbPostResult.results.fbPostId, accessToken: fbPage.accessToken
        });

        let message = `- Domain: ${post.domain}
- Post Id: ${post.postId}
- FB Post Id: ${fbPostResult.results.fbPostId}
- Fan Page: ${fbPage.name}
- Link: ${shortLinkResult && shortLinkResult.code === 200 ? shortLinkResult.results.short : post.url}
- Link FB: ${fbPostLinkResult ? fbPostLinkResult.results.url : 'N/A'}
- Trạng thái: Thành công`;

        await notificationService.send(message, {
            appName: 'AI - Creative Poster - Auto Post Facebook',
            enable: facebookGraphConfigs.telegramBot.enable,
            token: facebookGraphConfigs.telegramBot.token,
            chatId: facebookGraphConfigs.telegramBot.chatId
        });
    }
    return true;
};

start().then(e => {
    process.exit(0);
});
