# **Tài liệu hướng dẫn phát triển**

_Dưới đây là 1 số các hướng dẫn cách dev với bộ source code mới._

###  **Giới thiệu về các file cấu hình**
   * `configs/config.json` chưa cấu hình database để phục vụ cho việc migrate database
   * `configs/config.js` chứa cầu hình của dự án, các config có thể được nạp từ file .env
   

### **Giới thiệu về các file trên thư mục gốc**
   * `package.json`
   * `README.md` nhớ đọc file này trước nhé
   * `server.js` đây là file chạy chính của source code (nó giống với file index.php)
   * `swagger.js` đây là file để gen và chạy api docs
   * `libs` thư mục chứa 1 số lib tự viết
   * `modules` chứa source code của các modules cần phát triển 


### **Giới thiệu về modules**

   * Cấu trúc thư mục & files của 1 module
     * `controllers`
     * `helpers`
     * `middlewares`
     * `migrations`
     * `models`
     * `routes`
     * `seeders`
     * `services`
   * Cách tạo 1 module:
     * Mở thư mục modules -> Tạo 1 thư mục với tên module cần tạo (Lưu ý: Tên ngắn gọn, dễ hiểu, chữ thường)

### 1. Controllers

Một controller sẽ có cấu trúc code như sau:
```js
module.exports = {
    action1: async (req, res) => {
        // thêm code cần xử lý
        return res.json({
            status: 1,
            code: 200,
            data: []
        });
    },
    action2: async (req, res) => {
        // thêm code cần xử lý
        return res.json({
            status: 1,
            code: 200,
            data: []
        });
    }
}
```

### 2. Helpers

Ví dụ về helper:
```js
module.exports = {
    /*
     * SLUGS MODULE
     * By Aaron Stannard (aaron@stannardlabs.com)
     */
    slug: (incString, separator, preserved) => {

        let p = ['.', '=', '-'],
            s = '-';

        if (typeof preserved != 'undefined') {
            p = preserved;
        }

        if (typeof separator != 'undefined') {
            s = separator;
        }

        return incString.toLowerCase()
            .replace(/ü/g, 'ue')
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ß/g, 'ss')
            .replace(new RegExp('[' + p.join('') + ']', 'g'), ' ')    //  replace preserved characters with spaces
            .replace(/-{2,}/g, ' ')     //  remove duplicate spaces
            .replace(/^\s\s*/, '').replace(/\s\s*$/, '')    //  trim both sides of string
            .replace(/[^\w\ ]/gi, s)   //  replaces all non-alphanumeric with empty string
            .replace(/[\ ]/gi, s)   //  Convert spaces to dashes
    },
    toNumber: (string) => {
        return farmHash.fingerprint32(string)
    }
}
```

### 3. Middlewares

Một middleware sẽ có cấu trúc code như sau:
```js
module.exports = async (req, res, next) => {
    try {
        // thêm code cần xử lý
        next();
    } catch (error) {
        res.status(400).json({
            status: 0,
            code: 400,
            message: "Bad request"
        });
    }
}
```

### 4. Migrations

Một file migrate có cấu trúc code như sau:
```js
'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('g_kas_clusters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            }, 
            name: {
                type: Sequelize.STRING
            },
            slug: {
                type: Sequelize.STRING
            },
            slugCrc: {
                type: 'bigint(30)'
            }
        }, { charset: 'utf8', collate: 'utf8_unicode_ci' }).then(() => {
            return queryInterface.addIndex('g_kas_clusters', {
                name: 'idx_cluster',
                fields: ['slugCrc', 'allow'],
                unique: false
            });
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('g_kas_clusters');
    }
}
```

Để tạo được file này thì cần di chuyển vào 1 thư mục module xác định:

Run `cd modules/kafka`

Run `npx sequelize-cli migration:generate --name action-ten-table`

### 5. Models

Một file migrate có cấu trúc code như sau:

```js
'use strict';
const CoreModel = require("../../../libs/core/model");
const coreModels = require('../../core/models/index')
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cluster extends CoreModel {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    // enable model cache
    Cluster.cache = false

    Cluster.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: DataTypes.STRING,
        version: DataTypes.STRING,
        slug: DataTypes.STRING,
        slugCrc: DataTypes.INTEGER,
        allow: DataTypes.INTEGER,
        endpoint: DataTypes.STRING
    }, {
        sequelize,
        tableName: 'g_kas_clusters', // tên bảng
        modelName: 'Cluster' // tên object
    })
    return Cluster
}
```

### 6. Routes

### 7. Seeders

### 8. Services
