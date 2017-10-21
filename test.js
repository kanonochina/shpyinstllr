const puppeteer = require('puppeteer');
const url = "https://shop-mermaid-blanket.myshopify.com/admin/";
const userfield = '#Login';
const pwfield = '#Password';
const loginButton = "#LoginSubmit";
const username = "abdullahtheecom@gmail.com";
const password = "Abdullah1!";
const uploadTheme = "#themes-index > section:nth-child(4) > div > div.ui-annotated-section__annotation > div.ui-annotated-section__description > button";
const chooseFile = "#upload_theme_form > div.ui-modal__body > div > div > div:nth-child(5) > input[type=\"file\"]:nth-child(2)";
const uploadButton = "#upload_theme_form > div.ui-modal__footer > div > div.ui-modal__primary-actions > div > button";


var generateSampleRefundPolicy = "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(1) > div > div.next-input-wrapper > div > button";
var getSampleRefundPolicyText = "#shop_refund-policy";

var generateSamplePrivacyPolicy = "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(2) > div > div.next-input-wrapper > div > button";
var getSamplePrivacyPolicyText = "#shop_privacy-policy";

var generateTermsOfService = "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(3) > div > div.next-input-wrapper > div > button";
var getTermsOfServiceText = "#shop_terms-of-service";

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        userDataDir: "~/Library/Application Support/Google/Chrome"

    });
    const page = await browser.newPage();




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




    await page.goto(url);
    await page.waitFor(2000);
    gotoCheckoutSettings();   //to get generated text
    await page.waitFor(2000);
    let refundpage = await getGeneratedText(generateSampleRefundPolicy, getSampleRefundPolicyText);

    let privacypage = await getGeneratedText(generateSamplePrivacyPolicy, getSamplePrivacyPolicyText);


    let termspage = await getGeneratedText(generateTermsOfService, getTermsOfServiceText);

    // await createNewPage("Shipping Returns and Exchanges", refundpage);
    // await createNewPage("Privacy Policy", privacypage);
    // await createNewPage("Terms of Service", termspage);
    await createContactPage("Contact Us");















    // var actionspop = await page. $ ( "#settings-shop-policies > div.ui-annotated-section__content > section > div:nth-child(1) > div > div.next-input-wrapper > div > button" );
    // await actionspop.click();

    //   var actionspop = await page. $ ( ".ui-stack-item.themes-list__actions  > div > button" );
    //   await actionspop.click();
    //   await page.waitFor (2000);
    // var publish = await page.$("#ui-popover--1 > div.ui-popover__content-wrapper > div > div > div:nth-child(1) > ul > li:nth-child(2) > button");
    //   await publish.click();
    //   await page.waitFor (2000);
    // var confirm = await page.$("form > div.ui-modal__footer > div > div.ui-modal__primary-actions > div > button");
    //   await confirm.click();
    //   await page.waitFor (2000);
}

run();

