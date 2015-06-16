/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.test;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import org.greenpole.entity.model.holder.Administrator;
import org.greenpole.entity.model.holder.Holder;
import org.greenpole.entity.response.Response;
import org.greenpole.entity.security.Login;
import org.greenpole.service.ClientCompanyComponentService;
import org.greenpole.service.HolderComponentService;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm) <>
 */
public class ServiceTest {
    public void run() throws MalformedURLException {
        URL url = new URL("http://100.100.100.139:7001/greenpole-engine/holderservice?wsdl");
        QName qname = new QName("http://service.greenpole.org/", "holderservice");
        
        Service service = Service.create(url, qname);
        HolderComponentService port = service.getPort(HolderComponentService.class);
        
        Login login = new Login("akinwale.agbaje@africaprudentialregistrars.com", null);
        
        Holder h = new Holder();
        Administrator admin = new Administrator();
        List<Administrator> adminlist = new ArrayList<>();
        
        h.setHolderId(5);
        admin.setFirstName("Badmos");
        adminlist.add(admin);
        h.setAdministrators(adminlist);
        
        Response resp = port.createAdministrator_Request(login, "john.crane@yahoo.com", h);
        
        System.out.println("Retn: " + resp.getRetn());
        System.out.println("Desc: " + resp.getDesc());
    }
    
    public static void main(String[] args) throws MalformedURLException {
        new ServiceTest().run();
    }
}
