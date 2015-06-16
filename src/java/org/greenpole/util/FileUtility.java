
package org.greenpole.util;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import static java.nio.file.FileVisitResult.CONTINUE;
import static java.nio.file.FileVisitResult.TERMINATE;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;

/**
 * <h1>FileUtility</h1>
 * This class is responsible for any file related task
 * @author Yusuf Samsudeen Babashola (Algorithm)
 * 
 */
public class FileUtility {
    
    /**
     * <h1>Finder</h1>
     * A file search class
     * @author Yusuf Samsudeen Babashola (Algorithm)
     */
    public static class Finder extends SimpleFileVisitor<Path>{
        private final PathMatcher matcher;
        private Path name;
        private Path FileAbsolutePath;
        private int numMatches=0;
        
        /**
         * 
         * @param pattern 
         */
        public Finder (String pattern){
            matcher=FileSystems.getDefault().getPathMatcher("glob:"+pattern);
        }
        
        /**
         * 
         * @param file 
         */
        void find(Path file){
            name=file.getFileName();
            if(name!=null && matcher.matches(name)){
                numMatches++;
                FileAbsolutePath=file;
            }
        }
        
        /**
         * 
         * @return 
         */
       public Path done(){
            return FileAbsolutePath;
        }
        
       /**
        * 
        * @param file
        * @param attr
        * @return 
        */
        @Override
        public FileVisitResult visitFile(Path file,BasicFileAttributes attr){
            find(file);
            if(numMatches>0)
                return TERMINATE;
            return CONTINUE;
        }
        
        /**
         * 
         * @param file
         * @param ex
         * @return 
         */
        @Override
        public FileVisitResult visitFileFailed(Path file,IOException ex){
            System.err.println(ex);
            return CONTINUE;
        }
        
        
    }
}
