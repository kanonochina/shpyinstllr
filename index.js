
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const puppeteer = require('puppeteer');
const loginButton = "#LoginSubmit";

const userfield = '#Login';
const pwfield = '#Password';
const uploadTheme = "#themes-index > section:nth-child(4) > div > div.ui-annotated-section__annotation > div.ui-annotated-section__description > button";
const chooseFile = "input[type=file]";
const uploadButton = "#upload_theme_form > div.ui-modal__footer > div > div.ui-modal__primary-actions > div > button";


var generateSampleRefundPolicy = "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(1) > div > div.next-input-wrapper > div > button";
var getSampleRefundPolicyText = "#shop_refund-policy";

var generateSamplePrivacyPolicy = "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(2) > div > div.next-input-wrapper > div > button";
var getSamplePrivacyPolicyText = "#shop_privacy-policy";

var generateTermsOfService = "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(3) > div > div.next-input-wrapper > div > button";
var getTermsOfServiceText = "#shop_terms-of-service";


async function run(urlstore, user, pword) {

    
    let url = urlstore;
    let username = user;
    let password = pword;
    // Debug

    // const browser = await puppeteer.launch({
    //     headless: false,
    //     devtools: true,
    //     userDataDir: "~/Library/Application Support/Google/Chrome"
    // });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.click(userfield);
    await page.keyboard.type(username);

    await page.click(pwfield);
    await page.keyboard.type(password);

    await page.click(loginButton, { delay: 10000 });

    await page.waitForNavigation();
    console.log("Logged in successfully");
    await page.goto(url + "/themes");




    await page.click(uploadTheme);
    const fileUploaders = await page.$$("input[type=file]");
    await page.waitFor(5000);
 

    var filePath = __dirname + '/TMM-Shopify-Theme-V2.06-1.zip';
    console.log("filePath:" + filePath);
    var inputfileup = await page.$("input[type=file]");
    await inputfileup.uploadFile(filePath);
    await page.waitFor(2000);

    //   await page.uploadFile('./Shoptimized_Theme_4.00_1.zip');
    await page.click(uploadButton);
    await page.waitFor(60000);

    var actionspop = await page.$(".ui-stack-item.themes-list__actions  > div > button");
    await actionspop.click();
    await page.waitFor(2000);
    var publish = await page.$("#ui-popover--1 > div.ui-popover__content-wrapper > div > div > div:nth-child(1) > ul > li:nth-child(2) > button");
    await publish.click();
    await page.waitFor(2000);
    var confirm = await page.$("form > div.ui-modal__footer > div > div.ui-modal__primary-actions > div > button");
    await confirm.click();
    await page.waitFor(2000);
    console.log("Theme uploaded and installed. Now creating pages");

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

    await page.waitFor(2000);
    await gotoCheckoutSettings();   //to get generated text
    await page.waitFor(2000);
    let refundpage = await getGeneratedText(generateSampleRefundPolicy, getSampleRefundPolicyText);
    await page.waitFor(2000);
    let privacypage = await getGeneratedText(generateSamplePrivacyPolicy, getSamplePrivacyPolicyText);
    await page.waitFor(2000);

    let termspage = await getGeneratedText(generateTermsOfService, getTermsOfServiceText);
    await page.waitFor(2000);
    await createNewPage("Shipping Returns and Exchanges", refundpage);
    console.log("Shipping Returns and Exchanges page done");
    await createNewPage("Privacy Policy", privacypage);
    console.log("Privacy Policy page done");
    await createNewPage("Terms of Service", termspage);
    await createContactPage("Contact Us");
    console.log("Contact Us page done");
    await page.waitFor(2000);
    console.log("Finished");
    browser.close();
}

// run();

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
  console.log("Started on PORT 3000");
})