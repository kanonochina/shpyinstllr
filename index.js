
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var request = require("request");
// const puppeteer = require('puppeteer');

const selector = require('./configSelector');

async function run(urlstore, user, pword) {

    
    let url = 'https://' + urlstore + '.myshopify.com/admin';
    let username = user;
    let password = pword;
    // Debug

    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        userDataDir: "~/Library/Application Support/Google/Chrome"
    });
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();

    
        async function adminLogin() {  
                await page.goto(url);
                console.log(selector.userfield);
                await page.click(selector.userfield);
                await page.keyboard.type(username);
    
                await page.click(selector.pwfield);
                await page.keyboard.type(password);
    
                await page.click(selector.loginButton, { delay: 10000 });
    
                await page.waitForNavigation();
                console.log("Logged in successfully");
        }
    

    async function gotoApps() {
        await page.goto(url + '/apps/private/new');
        await page.waitFor(2000);
        var codeTxt;
        await page.evaluate((codeTxt) => {
            document.getElementById("api_client_title").value = "Theme";
            document.getElementById("api_client_contact_email").value = "markangelo@themillionairemastermind.com";
           
           document.getElementById("api_client[access_scope][content][authenticated]").value = "write_content";
            document.getElementById("api_client[access_scope][themes][authenticated]").value = "write_themes";
           document.getElementById("api_client[access_scope][products][authenticated]").value = "write_products";
           document.getElementById("api_client[access_scope][product_listings][authenticated]").value = "write_product_listings";
           $( "button:contains('Save')" )[0].click();
        }, codeTxt);
        await page.waitFor(2000);
    }


    async function getAPI() {
        await page.waitFor(2000);
        const result = await page.evaluate(() => {
            let userapi = document.querySelector('#api_key').value;
            let paswordapi = document.querySelector('#private_app_password').value;
    
            return {
                userapi,
                paswordapi
            }
    
        });

        console.log(result.userapi);
        console.log(result.paswordapi);


        shopifyCreatePage("POST", "pages.json", urlstore, result.userapi, result.paswordapi, "FAQ", selector.htmlFAQ);
        shopifyCreatePage("POST", "pages.json", urlstore, result.userapi, result.paswordapi, "PRIVACY POLICY", selector.htmlPrivatePolicy);
        shopifyCreatePage("POST", "pages.json", urlstore, result.userapi, result.paswordapi, "RETURN POLICY", selector.htmlReturnPolicy);
        shopifyCreatePage("POST", "pages.json", urlstore, result.userapi, result.paswordapi, "TERMS OF SERVICES", selector.htmlTermsofService);
        shopifyCreatePage("POST", "pages.json", urlstore, result.userapi, result.paswordapi, "CONTACT US", "", "contact");
        shopifyInstallTheme("POST", "themes.json", urlstore, result.userapi, result.paswordapi);
        
        
        shopifyCreateCollection("POST", "custom_collections.json", urlstore, result.userapi, result.paswordapi, "Gadgets");
        shopifyCreateCollection("POST", "custom_collections.json", urlstore, result.userapi, result.paswordapi, "Kitchen Products");
        shopifyCreateCollection("POST", "custom_collections.json", urlstore, result.userapi, result.paswordapi, "Beauty & Cosmetics");
        shopifyCreateCollection("POST", "custom_collections.json", urlstore, result.userapi, result.paswordapi, "Pet Essentials");
        shopifyCreateCollection("POST", "custom_collections.json", urlstore, result.userapi, result.paswordapi, "Home Accessories");


        await page.waitFor(15000);
    }
    

    await adminLogin();
    await gotoApps();
    await getAPI();
  
    browser.close();
}


    function shopifyCreatePage(method, pathapi, storeurl, userapi, paswordapi, title, body, template) {
        var options = {
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body:{
                    page:{
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
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body:{ theme: 
            { name: 'TheMMThemeAutoInstall',
              src: 'http://themillionairemastermind.com/SCA/TheMillionaireMastermindTheme.zip',
              role: 'main' } },
        json: true };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    }
    
    
    function shopifyCreateCollection(method, pathapi, storeurl, userapi, paswordapi, collectiontitle) {
        var options = {
            method: method, url: 'https://' + userapi + ':' + paswordapi + '@' + storeurl + '.myshopify.com/admin/' + pathapi, body: { custom_collection: { title: collectiontitle } },
            json: true };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    }


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("./src/index.html");
});
app.post('/login',function(req,res){
  var urlstore= req.body.urlstore;
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  run(urlstore, user_name, password);
  res.end("yes");
});
app.listen(3000,function(){
   
  console.log("Started on PORT 3000");
})


