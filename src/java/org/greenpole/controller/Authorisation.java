/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.controller;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;
import org.greenpole.entity.response.Response;
import org.greenpole.util.CastorOil;
import org.greenpole.util.ServiceEngine;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
@Controller
public class Authorisation {
    
    @RequestMapping(value="authorisation/{component}/{source}/{status}",method=RequestMethod.GET)
    public @ResponseBody String authorise(@PathVariable ("status") String status, @RequestParam("code") String code,
            @PathVariable ("source") String source,@PathVariable ("component") String component,
            HttpSession httpSession,CastorOil castoroil,ServiceEngine serviceEngine){
        int status_code = 0;
        Response response = null ;
        String message = "" ;
        try {  
            System.out.println("cipheredcode="+code);
            //code = castoroil.decrypt(code, httpSession);
            System.out.println("plain code="+code);
            switch (source){
                case "clientcompany":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_CLIENT_COMPANY_CREATION : ServiceEngine.DECLINE_CLIENT_COMPANY_CREATION;
                     break;
                case "bondoffer":
                    status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_SETUP_BOND_OFFER : ServiceEngine.DECLINE_SETUP_BOND_OFFER;
                    break;
                case "initialpublicoffer":
                    status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_INITIAL_PUBLIC_OFFER: ServiceEngine.DECLINE_INITIAL_PUBLIC_OFFER;
                    break;
                case "privateplacement":
                    status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_PRIVATE_PLACEMENT : ServiceEngine.DECLINE_PRIVATE_PLACEMENT;
                    break;
                case "shareunitquotation":
                    status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_SHARE_UNIT_QUOTATION_UPLOAD : ServiceEngine.DECLINE_SHARE_UNIT_QUOTATION_UPLOAD;
                     break;
                case "shareholder":
                     status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_SHAREHOLDER_ACCOUNT_CREATION : ServiceEngine.DECLINE_SHAREHOLDER_ACCOUNT_CREATION;
                    break;
                case "bondholder":
                     status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_BONDHOLDER_ACCOUNT_CREATION : ServiceEngine.DECLINE_BONDHOLDER_ACCOUNT_CREATION;
                     break;
                case "holderSignature":
                    status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_HOLDER_SIGNATURE_UPLOAD : ServiceEngine.AUTHORISE_HOLDER_SIGNATURE_UPLOAD;
                    break;
                case "powerOfAttorney":
                    status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_HOLDER_POWER_OF_ATTORNEY_UPLOAD : ServiceEngine.DECLINE_HOLDER_POWER_OF_ATTORNEY_UPLOAD;
                     break;
                case "mergeAccounts":
                     status_code =  status.equals("authorise") ? ServiceEngine.AUTHORISE_HOLDER_ACCOUNT_MERGE : ServiceEngine.DECLINE_HOLDER_ACCOUNT_MERGE;
                    break;
                case "shareUnitTransfer":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_SHARE_UNIT_TRANSFER : ServiceEngine.DECLINE_SHARE_UNIT_TRANSFER;
                    break;
                case "deMergeAccount":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_SHARE_HOLDER_ACCOUNT_DEMERGE : ServiceEngine.DECLINE_SHARE_HOLDER_ACCOUNT_DEMERGE;
                    break;
                case "transpose":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_HOLDER_NAME_TRANSPOSE : ServiceEngine.DECLINE_HOLDER_NAME_TRANSPOSE;
                    break;
                case "bondUnitTransfer":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_BOND_UNITS_TRANSFER : ServiceEngine.DECLINE_BOND_UNITS_TRANSFER;
                    break;
                case "createAdministrator":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_HOLDER_ADMINISTRATOR_CREATION : ServiceEngine.DECLINE_HOLDER_ADMINISTRATOR_CREATION;
                    break;
                case "editclientcompany":
                    status_code = status.equals("authorise") ? ServiceEngine.AUTHORISE_CLIENT_COMPANY_DETAILS_EDIT : ServiceEngine.DECLINE_CLIENT_COMPANY_DETAILS_EDIT;
                    break;
                default :
                    break;
            }
            
            switch (component){
                case "clientcompany":
                    if(status_code!=0){
                        response = serviceEngine.sendClientCompanyAuthorisation(httpSession, code, status_code);
                        message = response.getDesc();
                    }
                    else{

                    }
                    break;
                case "holder":
                    if(status_code!=0){
                        response = serviceEngine.sendHolderAuthorisation(httpSession, code, status_code);
                        message = response.getDesc();
                    }
                    else{

                    }
                break;
                default:
                    break;
            }
            
        } catch (Exception ex) {
            Logger.getLogger(Authorisation.class.getName()).log(Level.SEVERE, null, ex);
        }
        if(message==null || message.isEmpty())
            message = "Invalid Request";
        return message;
    }
}
