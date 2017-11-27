

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var request = require("request");

const selector = require('./configSelector');


function run(urlstore, user, pword) {
    var storeurl = urlstore,
    userapi = user,
    paswordapi = pword;
    function shopifyCreatePage(method, pathapi, storeurl, userapi, paswordapi, title, body, template) {
        var options = {
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body: {
                page: {
                    title: title,
                    body_html: body,
                    template_suffix: template,
                    published: true
                }
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    }
    function shopifyInstallTheme(method, pathapi, storeurl, userapi, paswordapi) {
        var options = {
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body: {
                theme:
                    {
                        name: 'TheMMThemeAutoInstall',
                        src: 'http://themillionairemastermind.com/SCA/TheMillionaireMastermindTheme.zip',
                        role: 'main'
                    }
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    }


    function shopifyCreateCollection(method, pathapi, storeurl, userapi, paswordapi, collectiontitle) {
        var options = {
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body: { custom_collection: { title: collectiontitle } },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    }




    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "FAQ", selector.htmlFAQ);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "PRIVACY POLICY", selector.htmlPrivatePolicy);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "RETURN POLICY", selector.htmlReturnPolicy);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "TERMS OF SERVICES", selector.htmlTermsofService);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "CONTACT US", "", "contact");
    shopifyInstallTheme("POST", "themes.json", urlstore, userapi, paswordapi);


    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Gadgets");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Kitchen Products");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Beauty & Cosmetics");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Pet Essentials");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Home Accessories");

}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendfile("./process/index.html");
});
app.post('/login', function (req, res) {
    var urlstore = req.body.urlstore;
    var user_name = req.body.user;
    var password = req.body.password;
    console.log("User name = " + user_name + ", password is " + password);
    run(urlstore, user_name, password);
    res.end("yes");
});
app.listen(3000, function () {
    console.log("Started on PORT 3000");
})

