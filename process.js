var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require("request");
const selector = require('./configSelector');

server.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/src/index.html');
});

io.on('connection', function (socket) {

    // socket.emit('news', { hello: 'world' });


    socket.on('my other event', function (data) {
        console.log(data.url, data.api, data.secret); //will go to client
    //    call function here
    run(data.url, data.api, data.secret);

    setTimeout(function() {
        socket.emit('news', { hello: 'Complete' });
    }, 5000);
  
 
    });
   
   
   
    function fire() {
        socket.emit('news', { hello: 'fire' });
    }
});




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
           
        });
    }


    function shopifyCreateCollection(method, pathapi, storeurl, userapi, paswordapi, collectiontitle) {
        var options = {
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body: { custom_collection: { title: collectiontitle } },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            

        });
    }




    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "FAQ", selector.htmlFAQ);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "PRIVACY POLICY", selector.htmlPrivatePolicy);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "RETURN POLICY", selector.htmlReturnPolicy);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "TERMS OF SERVICES", selector.htmlTermsofService);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "ORDER LOOKUP", selector.htmltrackorder);
    shopifyCreatePage("POST", "pages.json", urlstore, userapi, paswordapi, "CONTACT US", "", "contact");
    shopifyInstallTheme("POST", "themes.json", urlstore, userapi, paswordapi);


    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Gadgets");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Kitchen Products");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Beauty & Cosmetics");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Pet Essentials");
    shopifyCreateCollection("POST", "custom_collections.json", urlstore, userapi, paswordapi, "Home Accessories");

    
        
    

}



