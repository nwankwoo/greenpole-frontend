package org.greenpole.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import org.greenpole.util.DataStore;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpSession;
import org.greenpole.entity.model.clientcompany.UnitTransfer;
import org.greenpole.entity.model.holder.Holder;
import org.greenpole.entity.model.holder.HolderMerger;
import org.greenpole.entity.model.holder.HolderSignature;
import org.greenpole.entity.model.holder.PowerOfAttorney;
import org.greenpole.entity.notification.NotificationWrapper;
import org.greenpole.util.CastorOil;
import org.greenpole.util.ServiceEngine;
import org.greenpole.util.Utility;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * <h1>UtilityController</h1>
 * This class is responsible for handling some utility request from the user
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
@Controller
public class UtilityController {
    
    /**
     * This method returns a List of department / Unit mapping to the user
     * @param util
     * @return
     * @throws Exception 
     */
    @RequestMapping(value="getDepartments",method=RequestMethod.GET)
    public @ResponseBody List getDepartment(Utility util) throws Exception{
      /* 
        List <Unit> UnitList=new ArrayList();
        UnitList.add(new Unit(1,"Front Office"));
        UnitList.add(new Unit(2,"Back Office"));
        UnitList.add(new Unit(3,"Reconciliation Unit"));
        UnitList.add(new Unit(4,"Stockbroker Unit"));
        UnitList.add(new Unit(5,"Verification Unit"));
        
        List <Department> DepartmentMap=new ArrayList();
        DepartmentMap.add(new Department(14,"Operations Department",UnitList));
        
        UnitList=new ArrayList();
        UnitList.add(new Unit(1,"Statutory Affairs"));
        UnitList.add(new Unit(2,"Account Management"));
        
        DepartmentMap.add(new Department(1,"Finance Department",UnitList));
        String JSON=util.convertObjectToJSONString(DepartmentMap);
        System.out.println(JSON);*/
        return new ArrayList();
    }
    
    /**
     *
     * @param pageSize
     * @param page
     * @param dataStore
     * @param dataSore
     * @param httpSession
     * @return
     */
   
    /**
     *
     * @param from
     * @param to
     * @param code
     * @param castoroil
     * @param util
     * @param dataStore
     * @param httpSession
     * @param serviceEngine
     * @return
     * @throws java.io.UnsupportedEncodingException
     */
    @RequestMapping("index/{from}/{to}/{code}")
    public ModelAndView  getNotificationView(@PathVariable("from") String from,@PathVariable("to") String to,
            @PathVariable("code") String code, HttpSession httpSession,DataStore dataStore,
            CastorOil castoroil,Utility util,ServiceEngine serviceEngine) throws UnsupportedEncodingException, IOException{
        List<NotificationWrapper> notifications = (List<NotificationWrapper>) dataStore.getObject("notifications", httpSession);
        NotificationWrapper notificationObject = null;
        String className = "";
        Object modelObject = null;
        String viewName = "";
        ModelAndView mv = new ModelAndView();
        for(NotificationWrapper notification : notifications){
            if(notification.getTo().equalsIgnoreCase(to) && notification.getFrom().equalsIgnoreCase(from) && notification.getCode().equalsIgnoreCase(code)){
                notificationObject = notification;
                break;
            }
        }
        if(notificationObject != null){
            List modelList = notificationObject.getModel();
            String notificationType = notificationObject.getNotificationType();
            System.out.println(util.convertObjectToJSONString(notificationObject));
            if(modelList.size()==1){
                modelObject = modelList.get(0);
                //className = modelObject.getClass().toString();
                //className = className.substring(6);
                //className = className.substring(className.lastIndexOf(".")+1); .concat(className);
                viewName = "authorisation/";
                System.out.println("ntp="+notificationType);
                switch (notificationType){
                    case "demerge_accounts":
                        viewName =  viewName.concat("ShareholderAccountDeMerge");
                        HolderMerger merger = (HolderMerger) modelObject;
                        Holder holder = util.getHolder(serviceEngine, httpSession, merger.getPrimaryHolder().getHolderId());
                        mv.addObject("holder", holder);
                        System.out.println(util.convertObjectToJSONString(holder));
                        break;
                    case "create_shareholder":
                        viewName = viewName.concat("shareholder");
                        break;
                    case "transfer_shares":
                        UnitTransfer unitTransfer = (UnitTransfer) modelObject;
                        
                        Holder sourceHolder = util.getHolder(serviceEngine, httpSession, unitTransfer.getHolderIdFrom());
                        Holder destinationHolder = util.getHolder(serviceEngine, httpSession, unitTransfer.getHolderIdTo());
                        System.out.println("ccid="+unitTransfer.getClientCompanyId());
                       // ClientCompany clientCompany = util.getClientCompany(serviceEngine, httpSession, unitTransfer.getClientCompanyId());
                        
                        viewName = viewName.concat("ShareUnitTransfer");
                        mv.addObject("sourceHolder", sourceHolder);
                        mv.addObject("destinationHolder", destinationHolder);
                       // mv.addObject("clientCompany", clientCompany);
                    case "transpose":
                        Holder main = (Holder) modelObject;
                        viewName = viewName.concat("HolderNameTranspose");
                        Holder transposeholder = util.getHolder(serviceEngine, httpSession, main.getHolderId());
                        mv.addObject("holder", transposeholder);
                    case "transfer_bonds":
                         UnitTransfer BondUnitTransfer = (UnitTransfer) modelObject;
                        
                        Holder BondSourceHolder = util.getHolder(serviceEngine, httpSession, BondUnitTransfer.getHolderIdFrom());
                        Holder BondDestinationHolder = util.getHolder(serviceEngine, httpSession, BondUnitTransfer.getHolderIdTo());
                       // System.out.println("ccid="+unitTransfer.getClientCompanyId());
                       // ClientCompany clientCompany = util.getClientCompany(serviceEngine, httpSession, unitTransfer.getClientCompanyId());
                        
                        viewName = viewName.concat("BondUnitTransfer");
                        mv.addObject("sourceHolder", BondSourceHolder);
                        mv.addObject("destinationHolder", BondDestinationHolder);
                       // mv.addObject("clientCompany", clientCompany);
                    case "create_bondholder":
                         viewName = viewName.concat("bondholder");
                        break;
                    case "upload_power_of_attorney":
                        PowerOfAttorney poa = (PowerOfAttorney) modelObject;
                        Holder poaHolder = util.getHolder(serviceEngine, httpSession, poa.getHolderId());
                        viewName = viewName.concat("PowerOfAttorney");
                        mv.addObject("holder", poaHolder);
                        break;
                    case "upload_holder_signature":
                        HolderSignature hs = (HolderSignature) modelObject;
                        Holder hsHolder = util.getHolder(serviceEngine, httpSession, hs.getHolderId());
                        viewName = viewName.concat("HolderSignature");
                        mv.addObject("holder", hsHolder);
                        break;
                    case "create_administrator":
                         viewName = viewName.concat("Administrator");
                         break;
                    case "edit_client_company":
                        viewName = viewName.concat("ClientCompanyDetailsEdit");
                        break;
                    case "setup_bond_offer":
                        viewName = viewName.concat("BondOffer");
                        break;
                    case "create_client_company":
                        viewName = viewName.concat("ClientCompany");
                        break;
                    case "setup_ipo":
                        viewName = viewName.concat("InitialPublicOffer");
                        break;
                    case "upload_unit_quotations":
                        viewName = viewName.concat("ShareQuotation");
                        break;
                    default:
                        break;
                }
            }
        }
        
        System.out.println(util.convertObjectToJSONString(modelObject));
        mv.addObject("model",modelObject);
        mv.addObject("code",code );
        if (viewName!=null && !viewName.equals("")){
        mv.setViewName(viewName);
        }
        else{
            mv.setViewName("404");
        }
        //System.out.println("viewName =".concat(viewName));
        return mv;
    }
}
