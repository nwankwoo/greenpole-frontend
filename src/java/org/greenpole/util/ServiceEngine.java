/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.util;

import java.net.MalformedURLException;
import java.net.URL;
import javax.servlet.http.HttpSession;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import org.greenpole.entity.model.Carrier;
import org.greenpole.entity.model.clientcompany.BondOffer;
import org.greenpole.entity.model.clientcompany.ClientCompany;
import org.greenpole.entity.model.clientcompany.InitialPublicOffer;
import org.greenpole.entity.model.clientcompany.PrivatePlacement;
import org.greenpole.entity.model.clientcompany.QueryClientCompany;
import org.greenpole.entity.model.clientcompany.UnitTransfer;
import org.greenpole.entity.model.holder.Holder;
import org.greenpole.entity.model.holder.HolderMerger;
import org.greenpole.entity.model.holder.HolderSignature;
import org.greenpole.entity.model.holder.PowerOfAttorney;
import org.greenpole.entity.model.holder.QueryHolder;
import org.greenpole.entity.response.Response;
import org.greenpole.entity.security.Login;
import org.greenpole.service.ClientCompanyComponentService;
import org.greenpole.service.GeneralComponentService;
import org.greenpole.service.HolderComponentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
public class ServiceEngine {
    
    /**
     * Client Company Component Request constants
     */
    public static final int QUERY_SINGLE_CLIENT_COMPANY = 0;
    public final static int CREATE_CLIENT_COMPANY = 1;
    public final static int QUERY_CLIENT_COMPANY = 2;
    public final static int SETUP_BOND_OFFER = 3;
    public final static int SETUP_INITIAL_PUBLIC_OFFER = 4;
    public final static int SETUP_PRIVATE_PLACEMENT = 5;
    public final static int GET_SHARE_UNIT_QUOTATION = 6;
    public final static int UPLOAD_SHARE_UNIT_QUOTATION = 7;
    public static final int EDIT_CLIENT_COMPANY = 8;
    public static final int GET_SHARE_QUOTATION = 9;
    
    public static final int CREATE_SHAREHOLDER_ACCOUNT = 1;
    public static final int CREATE_BONDHOLDER_ACCOUNT = 2;
    public static final int UPLOAD_HOLDER_SIGNATURE = 3;
    public static final int CREATE_ADMINISTRATOR = 4;
    public static final int UPLOAD_POWER_OF_ATTORNEY = 5;
    public static final int TRANSPOSE_HOLDER_NAME = 6;
    public static final int QUERY_SHAREHOLDER_ACCOUNT = 7;
    public static final int MERGE_SHAREHOLDER_ACCOUNT = 8;
    public static final int TRANSFER_SHARE_UNIT = 9;
    public static final int TRANSFER_BOND_UNIT = 10;
    public static final int QUERY_BOND_HOLDER = 11;
    public static final int DEMERGE_SHAREHOLDER_ACCOUNT = 12;
    public static final int QUERY_ALL_SHARE_HOLDER_ACCOUNT = 13;
    
    public static final int GET_NOTIFICATIONS = 1;
    
    public static final int AUTHORISE_CLIENT_COMPANY_CREATION = 1;
    public static final int DECLINE_CLIENT_COMPANY_CREATION = 2;
    public static final int AUTHORISE_SETUP_BOND_OFFER = 3;
    public static final int DECLINE_SETUP_BOND_OFFER = 4;
    public static final int AUTHORISE_INITIAL_PUBLIC_OFFER = 5;
    public static final int DECLINE_INITIAL_PUBLIC_OFFER = 6;
    public static final int AUTHORISE_PRIVATE_PLACEMENT = 7;
    public static final int DECLINE_PRIVATE_PLACEMENT = 8;
    public static final int AUTHORISE_SHARE_UNIT_QUOTATION_UPLOAD = 9;
    public static final int DECLINE_SHARE_UNIT_QUOTATION_UPLOAD = 10;
    public static final int AUTHORISE_CLIENT_COMPANY_DETAILS_EDIT = 11;
    public static final int DECLINE_CLIENT_COMPANY_DETAILS_EDIT = 12;
    
    
    public static final int QUERY_SINGLE_HOLDER = 0;
    public static final int AUTHORISE_SHAREHOLDER_ACCOUNT_CREATION = 1;
    public static final int DECLINE_SHAREHOLDER_ACCOUNT_CREATION = 2;
    public static final int AUTHORISE_BONDHOLDER_ACCOUNT_CREATION = 3;
    public static final int DECLINE_BONDHOLDER_ACCOUNT_CREATION = 4;
    public static final int AUTHORISE_HOLDER_SIGNATURE_UPLOAD = 5;
    public static final int DECLINE_HOLDER_SIGNATURE_UPLOAD = 6;
    public static final int AUTHORISE_HOLDER_POWER_OF_ATTORNEY_UPLOAD = 7;
    public static final int DECLINE_HOLDER_POWER_OF_ATTORNEY_UPLOAD = 8;
    public static final int AUTHORISE_HOLDER_ACCOUNT_MERGE = 9;
    public static final int DECLINE_HOLDER_ACCOUNT_MERGE = 10;
    public static final int AUTHORISE_SHARE_UNIT_TRANSFER = 11;
    public static final int DECLINE_SHARE_UNIT_TRANSFER = 12;
    public static final int AUTHORISE_SHARE_HOLDER_ACCOUNT_DEMERGE = 13;
    public static final int DECLINE_SHARE_HOLDER_ACCOUNT_DEMERGE = 14;
    public static final int AUTHORISE_HOLDER_NAME_TRANSPOSE = 15;
    public static final int DECLINE_HOLDER_NAME_TRANSPOSE = 16;
    public static final int AUTHORISE_BOND_UNITS_TRANSFER = 17;
    public static final int DECLINE_BOND_UNITS_TRANSFER = 18;
    public static final int AUTHORISE_HOLDER_ADMINISTRATOR_CREATION = 19;
    public static final int DECLINE_HOLDER_ADMINISTRATOR_CREATION = 20;
    
    private  String getServiceURL(HttpSession httpSession,String localpart){
        Object serviceURL = httpSession.getAttribute(localpart);
        
        if(serviceURL == null){
            httpSession.setAttribute(localpart, "http://100.100.100.139:7001/greenpole-engine/"+localpart+"?wsdl");
            serviceURL = httpSession.getAttribute(localpart);
        }        
        return serviceURL.toString();
        
    }
    
    private String getQName(HttpSession httpSession){
        Object QName = httpSession.getAttribute("QName");
        
        if(QName == null){
            httpSession.setAttribute("QName", "http://service.greenpole.org/");
            QName = httpSession.getAttribute("QName");
        }
        return QName.toString();
    }
    
    private Service getService(HttpSession httpSession, String serviceName) throws MalformedURLException{
       URL url = new URL(this.getServiceURL(httpSession,serviceName));
        QName qname = new QName(this.getQName(httpSession), serviceName);        
        Service service = Service.create(url, qname); 
        return service;
    }
    
    
    private Login retriveLoginDetails(){
        Login login = null;
        try{
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        login = new Login(userId,"");
        
        }
        catch(Exception ex){
        ex.printStackTrace();
        }
        return login;
    }
    
    public Response sendClientCompanyRequests(HttpSession httpSession,Object requestObject,int requestMethod) throws MalformedURLException{
        Service service = this.getService(httpSession, "clientcompanyservice");
        ClientCompanyComponentService port = service.getPort(ClientCompanyComponentService.class);
        
        Response response;
        response = null;
        Login login = this.retriveLoginDetails();
        switch (requestMethod){
            case 0:
                response = port.queryClientCompany_Single_Request(login, (int) requestObject);
                break;
            case 1:
                response = port.createClientCompany_Request(login, "akinwale.agbaje@africaprudentialregistrars.com",(ClientCompany) requestObject);                
                break;
            case 2:
                response = port.queryClientCompany_Request(login, (QueryClientCompany) requestObject);
                break;
            case 3:
                response = port.setupBondOffer_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (BondOffer) requestObject);
                break;
            case 4:
                response = port.setupInitialPublicOffer_Request(login, "akinwale.agbaje@africaprudentialregistrars.com",(InitialPublicOffer) requestObject);
                
                break;
            case 5:
                response = port.setupPrivatePlacement_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (PrivatePlacement) requestObject);
                break;
            case 6:
                response = port.getShareUnitQuotations_request(login);
                break;
            case 7:
                response = port.uploadShareUnitQuotations_Request(login, "akinwale.agbaje@africaprudentialregistrars.com",(Carrier) requestObject);
                break;
            case 8:
                response = port.editClientCompany_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (ClientCompany) requestObject);
                break;
            case 9:
                response = port.getShareUnitQuotations_request(login);
                break;
            default:
                break;
        }
        return response; 
    }
    
    public Response sendHolderRequest(HttpSession httpSession, Object requestObject, int requestMethod) throws MalformedURLException{
        Service service = this.getService(httpSession, "holderservice");
        HolderComponentService port = service.getPort(HolderComponentService.class);
        Response response;
        response = null;
        Login login = this.retriveLoginDetails();
        switch(requestMethod){
            case 0:
                response = port.queryHolder_Single_Request(login, (int) requestObject);
                break;
            case 1:
                response = port.createShareHolder_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (Holder) requestObject);
                break;
            case 2:
                response = port.createBondHolderAccount_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (Holder) requestObject);
                break;
            case 3:
                response = port.uploadHolderSignature_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (HolderSignature) requestObject);
                break;
            case 4:
                response = port.createAdministrator_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (Holder) requestObject);
                break;
            case 5:
                response = port.uploadPowerOfAttorney_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (PowerOfAttorney) requestObject);
                break;
            case 6:
                response = port.transposeHolderName_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (Holder) requestObject);
                break;
            case 7:
                response = port.queryHolder_Request(login, (QueryHolder) requestObject);
                break;
            case 8:
                response = port.mergeHolderAccounts_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (HolderMerger) requestObject);
                break;
            case 9:
                response = port.transferShareUnitManual_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (UnitTransfer) requestObject);
                break;
            case 10:
                response = port.transferBondUnitManual_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (UnitTransfer) requestObject);
                break;
            case 11:
                response = port.queryHolder_Request(login, (QueryHolder) requestObject);
                break;
            case 12:
                response = port.demergeHolderAccounts_Request(login, "akinwale.agbaje@africaprudentialregistrars.com", (HolderMerger) requestObject);
                break;
            case 13:
                response = port.queryHolder_Request(login, (QueryHolder) requestObject);
                break;
            default:
                break;
        }
        return response;
    }
    
    public Response sendGeneralRequest(HttpSession httpSession,Object requestObject, int requestMethod) throws MalformedURLException{
        Service service = this.getService(httpSession, "generalservice");
        GeneralComponentService port = service.getPort(GeneralComponentService.class);
       Response response;
       response = null;
       Login login = this.retriveLoginDetails();
       switch (requestMethod){
           case 1:
               response = port.getReceiverNotifications_Request(login);
               break;
           default:
                break;
       }
       return response;
    }
    
    public Response sendClientCompanyAuthorisation (HttpSession httpSession,Object requestObject, int requestMethod) throws MalformedURLException{
        Service service = this.getService(httpSession, "clientcompanyservice");
        ClientCompanyComponentService port = service.getPort(ClientCompanyComponentService.class);
       Response response;
       response = null;
       Login login = this.retriveLoginDetails();
       switch (requestMethod){
           case 1:               
               response = port.createClientCompany_Authorise(login, (String) requestObject);
               break;
           case 3:
               response = port.setupBondOffer_Authorise(login, (String) requestObject);
               break;
           case 5:
               //IPO
               response = port.setupInitialPublicOffer_Authorise(login, (String) requestObject);
               break;
           case 7:
               //pp
               response = port.setupPrivatePlacement_Authorise(login, (String) requestObject);
               break;
           case 9:
               response = port.uploadShareUnitQuotations_Authorise(login, (String) requestObject);
               break;
           case 11:
               response = port.editClientCompany_Authorise(login, (String) requestObject);
               break;
           default:
                break;
       }
       return response;
    }
public Response sendHolderAuthorisation (HttpSession httpSession,Object requestObject, int requestMethod) throws MalformedURLException{
        Service service = this.getService(httpSession, "holderservice");
        HolderComponentService port = service.getPort(HolderComponentService.class);
       Response response;
       response = null;
       Login login = this.retriveLoginDetails();
       switch (requestMethod){
           case 1:               
               response = port.createShareHolder_Authorise(login, (String) requestObject);
               break;
           case 3:
               response = port.createBondHolderAccount_Authorise(login, (String) requestObject);
               break;
           case 5:
               response = port.uploadHolderSignature_Authorise(login, (String) requestObject);
               break;
           case 7:
               response = port.uploadPowerOfAttorney_Authorise(login, (String) requestObject);
               break;
            case 9:
               response = port.mergeHolderAccounts_Authorise(login, (String) requestObject);
               break;
            case 11:
                response = port.transferShareUnitManual_Authorise(login, (String) requestObject);
                break;
            case 13:
                response = port.demergeHolderAccounts_Authorise(login, (String) requestObject);
                break;
            case 15:
                response = port.transposeHolderName_Authorise(login, (String) requestObject);
                break;
            case 17:
                response = port.transferBondUnitManual_Authorise(login, (String) requestObject);
                break;
            case 19:
                response = port.createAdministrator_Authorise(login, (String) requestObject);
           default:
                break;
       }
       return response;
    }
}
