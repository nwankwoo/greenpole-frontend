/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpSession;
import org.apache.tomcat.util.codec.binary.Base64;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm) 
 */
public class CastorOil {
    
    private byte[] castorSessionKey;
    private byte[] castoriv;
    private HttpSession httpSession;

    

    /**
     * @param httpSession
     * @return the castorSessionKey
     */
    private byte[] getCastorSessionKey(HttpSession httpSession) {
       castorSessionKey = httpSession.getId().substring(0, 16).getBytes();
        return castorSessionKey;
    }

    /**
     * @return the castoriv
     */
    private byte[] getCastoriv(HttpSession httpSession) {
        castoriv = httpSession.getId().substring(0, 16).getBytes();
        return castoriv;
    }
    
    
    
    public String encrypt(String plainText,HttpSession httpSession) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException{
        byte[] text = plainText.getBytes();
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(this.getCastorSessionKey(httpSession),"AES"), new IvParameterSpec(this.getCastoriv(httpSession)));
        byte cipherByte[] = cipher.doFinal(text);
        cipherByte = Base64.encodeBase64(cipherByte);
        return new String(cipherByte);
    }
    
    public String decrypt(String cypherText,HttpSession httpSession) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException, IOException{
        
        byte[] text = Base64.decodeBase64(cypherText);
        //System.out.println("cipher 2="+encoder.encode(text));
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(this.getCastorSessionKey(httpSession),"AES"), new IvParameterSpec(this.getCastoriv(httpSession)));
        byte plainByte[] = cipher.doFinal(text);
        
        return new String(plainByte);
    }

}
