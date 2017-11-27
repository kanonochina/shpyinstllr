
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const puppeteer = require('puppeteer');

const selector = require('./configSelector');

async function run(urlstore, user, pword) {

    
    let url = urlstore;
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


    async function installTheme() {
        
        await page.goto(url + "/themes");
        await page.click(selector.uploadTheme);
        const fileUploaders = await page.$$("input[type=file]");
        await page.waitFor(5000);
        var filePath = __dirname + '/' + selector.themeZipfile;
        console.log("filePath:" + filePath);
        var inputfileup = await page.$("input[type=file]");
        await inputfileup.uploadFile(filePath);
        await page.waitFor(2000);
        await page.click(selector.uploadButton);
        await page.waitFor(60000);
    
        var actionspop = await page.$(selector.firstActions);
        await actionspop.click();
        await page.waitFor(2000);
        var publish = await page.$(selector.firstActionsPublilsh);
        await publish.click();
        await page.waitFor(2000);
        var confirm = await page.$(selector.confirmFirstActionPublish);
        await confirm.click();
        await page.waitFor(2000);
        console.log("Theme uploaded and installed. Now creating pages");
    }
    
    async function gotoCheckoutSettings() {
        await page.goto(url + '/settings/checkout');
        await page.waitFor(2000);
    }

    async function getGeneratedText(button, textbody) {
        var actionspop = await page.$(button);
        await actionspop.click();
        const nameElement = await page.$eval(textbody, function (heading) {
            return heading.value;
        })
        return nameElement.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

    async function createNewPage(titleText, codeTxt) {
        await page.waitFor(2000);
        await page.goto(url + '/pages/new');
        await page.waitFor(2000);
        var pageTitle = await page.$("#page-name");
        await pageTitle.click();
        await page.waitFor(2000);
        await page.keyboard.type(titleText);
        await page.waitFor(2000);
        let toCode = await page.$("#page-content_parent > div.rte-toolbar.for-rich-view > div > div > div > button");
        await toCode.click();
        await page.waitFor(2000);
        await page.evaluate((codeTxt) => {
            document.querySelector('#page-content').value = codeTxt;
        }, codeTxt);
        await page.waitFor(2000);
        let save = await page.$('[form="new_page"');
        await save.click();
        await page.waitFor(2000);
    }

    async function createContactPage(titleText) {
        await page.waitFor(2000);
        await page.goto(url + '/pages/new');
        await page.waitFor(2000);
        var pageTitle = await page.$("#page-name");
        await pageTitle.click();
        await page.waitFor(2000);
        await page.keyboard.type(titleText);
        await page.waitFor(2000);
        var codeTxt = "contact";
        await page.evaluate((codeTxt) => {
            document.querySelector('#page_template_suffix').value = codeTxt;
        }, codeTxt);
        await page.waitFor(2000);
        let save = await page.$('[form="new_page"');
        await save.click();
        await page.waitFor(2000);
    }

    async function gotoPreferences() {
        await page.goto(url);
        await page.goto(url + '/online_store/preferences');
        await page.waitFor(2000);
    }

    async function enableStore() {
        var codeTxt = 0;
        await page.evaluate((codeTxt) => {
            console.log(document.querySelector("#shop_password_enabled").checked);
            if (document.querySelector("#shop_password_enabled").checked) {
                document.querySelector("#shop_password_enabled").checked = false;
            }
        }, codeTxt);
        await page.click(selector.saveEnableStore);
    }


    await adminLogin();
    await installTheme();

    await page.waitFor(2000);
    await gotoCheckoutSettings();   //to get generated text
    await page.waitFor(2000);
    let refundpage = await getGeneratedText(selector.generateSampleRefundPolicy, selector.getSampleRefundPolicyText);
    await page.waitFor(2000);
    let privacypage = await getGeneratedText(selector.generateSamplePrivacyPolicy, selector.getSamplePrivacyPolicyText);
    await page.waitFor(2000);

    let termspage = await getGeneratedText(selector.generateTermsOfService, selector.getTermsOfServiceText);
    await page.waitFor(2000);
    await createNewPage("Shipping Returns and Exchanges", refundpage);
    console.log("Shipping Returns and Exchanges page done");
    await createNewPage("Privacy Policy", privacypage);
    console.log("Privacy Policy page done");
    await createNewPage("Terms of Service", termspage);
    await createContactPage("Contact Us");
    console.log("Contact Us page done");
    await page.waitFor(2000);
    await gotoPreferences();
    console.log("Enabling Store");
    await enableStore();
    console.log("Finished");
    browser.close();
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("./src/index.html");
});
app.post('/login',function(req,res){
  var urlstore=req.body.urlstore;
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  run(urlstore, user_name, password);
  res.end("yes");
});
app.listen(3000,function(){
    console.log(selector.firstActions);
  console.log("Started on PORT 3000");
})


