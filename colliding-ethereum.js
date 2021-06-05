var keythereum = require("keythereum");
var ethUtil = require("ethereumjs-util");
var fs = require('fs');
var dateFormat = require('dateformat');
var axios = require('axios');

var arguments = process.argv.splice(2);
// Interval of each impact
// 每次撞击时间间隔
var generateTime = parseInt(arguments[0]) > 0 ? parseInt(arguments[0]) : 500;
// saveFileName
// 保存文件名
var saveFileName = dateFormat(new Date(), "yyyymmddHHMMss");

function main () {
    var dk = keythereum.create();
    var privateKey = dk.privateKey;
    var address = ethUtil.privateToAddress(privateKey);
    // Generate the Ethereum address
    // 获取 以太坊 支付地址
    address = ethUtil.toChecksumAddress(address.toString("hex"));
    // Generate the Ethereum private key
    // 获取 以太坊 私钥
    privateKey = privateKey.toString("hex");
    // Query the Ethereum Block Browser transaction record
    // 通过以太坊区块浏览器查询地址是否有交易记录
    axios.get(`https://www.etherchain.org/account/{address}`, {timeout: 3000})
    .then(function (res) {
        if (res.data.indexOf('Account not found') == -1) {
            console.log(new Date().toString() + '|撞击成功！|' + address + '|' + privateKey);
            // 有交易记录，写入本地文件
            fs.appendFile('./' + saveFileName + 'yes_addresses_with_keys.txt', address + '|' + privateKey + "\n", 'utf8', function (err) {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            // 没有建议记录
            console.log(new Date().toString() + '|空地址,继续撞击中....');
        }
    })
    .catch(function () {
        // 一般为请求超时错误
        console.log(new Date().toString() + '|撞击超时，跳过....');
    })

}

// Enable timer
// 启用定时器
setInterval(() => {
    main()
}, generateTime);