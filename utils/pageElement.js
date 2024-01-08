class PageElements{
      /**
     * define selectors using getter methods
     */

    get inputPortalUserName(){
        return $('//input[@id="username"]');
    }

    get inputPortalPassword(){
        return $('//input[@id="password"]');
    }

    get btnLoginPortal(){
        return  $('//button[@class="c320322a4 c480bc568 c20af198f ce9190a97 cbb0cc1ad"]');
    }
   
    get selectDropDown(){
        return $('//span[@role="combobox"]');
    };

    get selectDropDownOptionTanda(){
        return $('//li[@data-value="Tanda"]');
    }

    get btnContinueOrSubmit(){
        return $('//button[@class="e-control e-btn e-lib ms-3 e-primary"]');
    };

    get inputTandaEmail(){
        return $('//input[@placeholder="Email address"]');
    };

    get inputTandaPassword(){
        return $('//input[@id="password"]');
    };

    get btnTandaLogin(){
        return $('//input[@id="login_button"]');
    };

    get inputClentID(){
        return $('/html/body/div[1]/div/div/div/div[1]/div/div/div/div[3]/form/div/div[1]/div/input');
    };

    get inputClentSecret(){
        return $('/html/body/div[1]/div/div/div/div[1]/div/div/div/div[3]/form/div/div[2]/div/input');
    };

    get btnAuthorize(){
        return $('//input[@class="button authorize"]');
    };

    get btnSyncData(){
        return $('//button[text()="Sync Data"]');
    };

}

export default new PageElements();