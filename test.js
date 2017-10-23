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
var enableCheckBox = "#shop_password_enabled";
var saveEnableStore = ".ui-button.ui-button--primary.js-btn-loadable.js-btn-primary.ui-context-bar__actions-primary";

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        userDataDir: "~/Library/Application Support/Google/Chrome"

    });
    const page = await browser.newPage();




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
        await page.click(saveEnableStore);
    }

await gotoPreferences();

await enableStore();







}

run();

