
package calendar;

import java.util.Scanner;

public class Calendar {

    
    
     public static int day(int M, int D, int Y) {
        int y = Y - (14 - M) / 12;
        int x = y + y/4 - y/100 + y/400;
        int m = M + 12 * ((14 - M) / 12) - 2;
        int d = (D + x + (31*m)/12) % 7;
        return d;
    }
     
      public static boolean isLeapYear(int year) {
        if  ((year % 4 == 0) && (year % 100 != 0)) return true;
        if  (year % 400 == 0) return true;
        return false;
    }
      
     public static void main(String[] args) {
         Scanner in = new Scanner(System.in);
         System.out.print("Please enter year of choice: ");
         String year_of_choice = in.nextLine();
         String [] monthList = {"1","2","3","4","5","6","7","8","9","10","11","12"};
            // month (Jan = 1, Dec = 12)
        int Y = Integer.parseInt(year_of_choice);    // year

        for(String month : monthList){
            System.out.println();
            System.out.println();
            System.out.println();
            int M = Integer.parseInt(month);
        // months[i] = name of month i
            String[] months = {
                 "",                               // leave empty so that months[1] = "January"
                 "January", "February", "March",
                 "April", "May", "June",
                 "July", "August", "September",
                 "October", "November", "December"
            };

            // days[i] = number of days in month i
            int[] days = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

            // check for leap year
            if (M == 2 && isLeapYear(Y)) days[M] = 29;


            // print calendar header
            System.out.println("   " + months[M] + " " + Y);
            System.out.println(" S  M Tu  W Th  F  S");

            // starting day
            int d = day(M, 1, Y);

            // print the calendar
            for (int i = 0; i < d; i++)
                System.out.print("   ");
            for (int i = 1; i <= days[M]; i++) {
                System.out.printf("%2d ", i);
                if (((i + d) % 7 == 0) || (i == days[M])) System.out.println();
            }
        }//end of for
        

    }  
}
