
const moment = require('moment');
module.exports = {

    formatDateTime: (date = null, fromDate = null, toDate = null) => {
        //type : date,hour
        let diffDay;
        if (fromDate) {
            fromDate = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
        }
        if (toDate) {
            toDate = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
        }
        if (toDate && fromDate) {
            const timeEndAndHour = (new Date(toDate)).getTime()
            const timeStartAndHour = (new Date(fromDate)).getTime()
            diffDay = Math.floor(((timeEndAndHour - timeStartAndHour) / 86400000) + 1);
        }
        let newDateTime = moment(date).format('YYYY/MM/DD HH:mm:ss');

        if (diffDay && diffDay > 1) {
            newDateTime = moment(date).format('DD/MM/YYYY');
        }
        // else {
        //     newDateTime = moment(date).format('HH:mm');
        // }
        return newDateTime;

    }


}