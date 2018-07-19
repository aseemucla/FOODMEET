package com.example.foodmeet;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.StrictMode;
import android.support.constraint.ConstraintLayout;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;

public class FrontPage extends AppCompatActivity {


    String[] grouplist = null;
    String username = "";
    ListView listView = null;
    CustomAdapter customAdapter = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_front_page);

        //StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        //StrictMode.setThreadPolicy(policy);

        // Get the Intent that started this activity and extract the string
        Intent intent = getIntent();
        username = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
        String responsestr = "";
        HttpGetRequest getRequest = new HttpGetRequest();
        //Perform the doInBackground method, passing in our url
        try {
            responsestr = getRequest.execute("0").get();
        }
        catch (Exception e){

        }

        grouplist = responsestr.split(",");
        listView = (ListView)findViewById(R.id.dynamicList);
        customAdapter = new CustomAdapter();
        listView.setAdapter(customAdapter);

    }

    public class HttpGetRequest extends AsyncTask<String, String, String> {
        @Override
        protected String doInBackground(String... params){
            String responsestr = "";
            if(params[0] == "0"){
                try{
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=GETFOODS&uname=" + username;
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();

                }
                catch(Exception e){

                }
            }
            if(params[0] == "1"){

                try{
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=ADDFOOD&uname=" + username + "&ufood=" + params[1];
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();




                }
                catch(Exception e){

                }

                try{
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=GETFOODS&uname=" + username;
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();

                }
                catch(Exception e){

                }


            }
            if(params[0] == "2"){
                try{
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=GROUPUSRS&ufood=" + params[1];
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();

                }
                catch(Exception e){

                }
            }
            if(params[0] == "3"){
                try{
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=WANTUSRS&ufood=" + params[1];
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();

                }
                catch(Exception e){

                }
            }
            if(params[0] == "4"){
                Calendar rightNow = Calendar.getInstance();
                int daytemp = rightNow.get(Calendar.DAY_OF_WEEK);
                String currday = "";
                switch (daytemp){
                    case Calendar.SUNDAY:
                        currday = "U";
                        break;
                    case Calendar.MONDAY:
                        currday = "M";
                        break;
                    case Calendar.TUESDAY:
                        currday = "T";
                        break;
                    case Calendar.WEDNESDAY:
                        currday = "W";
                        break;
                    case Calendar.THURSDAY:
                        currday = "R";
                        break;
                    case Calendar.FRIDAY:
                        currday = "F";
                        break;
                    case Calendar.SATURDAY:
                        currday = "S";
                        break;
                }



                try{
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=CHECKFREE&ufood=" + params[1] + "&uhour=" + rightNow.get(Calendar.HOUR_OF_DAY) + "uday=" + currday;
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();

                }
                catch(Exception e){

                }
            }
            if(params[0] == "5") {
                try {
                    String url = "http://aseemapi.us.openode.io/?desiredMethod=MOSTPOP&ugroup=" + params[1];
                    URL obj = new URL(url);
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    con.setRequestMethod("GET");
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    responsestr = response.toString();

                } catch (Exception e) {

                }
            }

            return responsestr;
        }
        @Override
        protected void onPostExecute(String result){
            super.onPostExecute(result);
        }
    }

    class CustomAdapter extends BaseAdapter {

        @Override
        public int getCount() {
            return grouplist.length + 1;
        }

        @Override
        public Object getItem(int position) {
            return null;
        }

        @Override
        public long getItemId(int position) {
            return 0;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if(position == grouplist.length && grouplist.length < 10){
                View view = getLayoutInflater().inflate(R.layout.frontpage_end, null);
                view.setOnClickListener(new View.OnClickListener()
                {
                    @Override
                    public void onClick(View view)
                    {
                        //view.setBackgroundColor(Color.parseColor("#ddffcc"));

                        View promptsView = getLayoutInflater().inflate(R.layout.add_group_popup, null);

                        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(view.getContext());

                        // set prompts.xml to alertdialog builder
                        alertDialogBuilder.setView(promptsView);

                        final EditText groupText = (EditText) promptsView
                                .findViewById(R.id.groupText);

                        // set dialog message
                        alertDialogBuilder
                                .setCancelable(false)
                                .setPositiveButton("OK",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(DialogInterface dialog,int id) {
                                                // get user input and set it to result
                                                // edit text
                                                String  responsestr = "";
                                                HttpGetRequest getRequest = new HttpGetRequest();
                                                //Perform the doInBackground method, passing in our url
                                                try {
                                                    responsestr = getRequest.execute("1", groupText.getText().toString()).get();
                                                }
                                                catch (Exception e){

                                                }

                                                grouplist = responsestr.split(",");
                                                customAdapter.notifyDataSetChanged();


                                            }
                                        })
                                .setNegativeButton("Cancel",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(DialogInterface dialog,int id) {
                                                dialog.cancel();
                                            }
                                        });

                        // create alert dialog
                        AlertDialog alertDialog = alertDialogBuilder.create();

                        // show it
                        alertDialog.show();
                    }
                });
                return view;
            }


            View view = getLayoutInflater().inflate(R.layout.frontpage_entry,null);
            ConstraintLayout bar1 = view.findViewById(R.id.bar1);
            ConstraintLayout bar2 = view.findViewById(R.id.bar2);
            ConstraintLayout bar3 = view.findViewById(R.id.bar3);
            ConstraintLayout bar4 = view.findViewById(R.id.bar4);
            ConstraintLayout bar5 = view.findViewById(R.id.bar5);
            bar1.setBackgroundColor(Color.parseColor("#ff8060"));
            bar2.setBackgroundColor(Color.parseColor("#ff8060"));
            bar3.setBackgroundColor(Color.parseColor("#ff8060"));
            bar4.setBackgroundColor(Color.parseColor("#ff8060"));
            bar5.setBackgroundColor(Color.parseColor("#ff8060"));

            String[] groupusrs = null;
            String[] wantusrs = null;
            String[] checkfree = null;
            String responsestr = "";
            String responsestr3 = "";
            String responsestr4 = "";
            String responsestr5 = "";

            HttpGetRequest getRequest = new HttpGetRequest();
            //Perform the doInBackground method, passing in our url
            try {
                responsestr = getRequest.execute("2", grouplist[position]).get();
            }
            catch (Exception e){

            }


            groupusrs = responsestr.split(",");
            HttpGetRequest getRequest3 = new HttpGetRequest();
            try {
                responsestr3 = getRequest3.execute("3", grouplist[position]).get();
            }
            catch (Exception e){

            }



            wantusrs = responsestr3.split(",");
            HttpGetRequest getRequest4 = new HttpGetRequest();
            try {
                responsestr4 = getRequest4.execute("4", grouplist[position]).get();
            }
            catch (Exception e){

            }



            checkfree = responsestr4.split(",");

            int totalusrs = Integer.parseInt(groupusrs[0]);
            int wanting = Integer.parseInt(wantusrs[0]);
            int freeusrs = Integer.parseInt(checkfree[0]);

            if(wanting > freeusrs){
                freeusrs = wanting;
            }

            if(totalusrs <= 5){
                view.setBackgroundColor(Color.parseColor("#ccffcc"));
            }
            else if(totalusrs <= 10){
                view.setBackgroundColor(Color.parseColor("#ccffff"));
            }
            else if(totalusrs <= 20){
                view.setBackgroundColor(Color.parseColor("#ffffcc"));
            }
            else{
                view.setBackgroundColor(Color.parseColor("#ffb3b3"));
            }

            TextView freeText = view.findViewById(R.id.freeFraction);
            TextView wantText = view.findViewById(R.id.wantFraction);

            freeText.setText(freeusrs + "/" + totalusrs);
            wantText.setText(wanting + "/" + totalusrs);

            float freeFrac = (float)freeusrs/(float)totalusrs;
            float wantFrac = (float)wanting/(float)totalusrs;

            if(freeFrac > 0.2) {
                bar1.setBackgroundColor(Color.parseColor("#ffff99"));
            }if(freeFrac > 0.4){
                bar2.setBackgroundColor(Color.parseColor("#ffff99"));
            }if(freeFrac > 0.6){
                bar3.setBackgroundColor(Color.parseColor("#ffff99"));
            }if(freeFrac > 0.75){
                bar4.setBackgroundColor(Color.parseColor("#ffff99"));
            }if(freeFrac > 0.85){
                bar5.setBackgroundColor(Color.parseColor("#ffff99"));
            }

            if(wantFrac > 0.1) {
                bar1.setBackgroundColor(Color.parseColor("#99ff99"));
            }if(wantFrac > 0.2){
                bar2.setBackgroundColor(Color.parseColor("#99ff99"));
            }if(wantFrac > 0.4){
                bar3.setBackgroundColor(Color.parseColor("#99ff99"));
            }if(wantFrac > 0.55){
                bar4.setBackgroundColor(Color.parseColor("#99ff99"));
            }if(wantFrac > 0.7){
                bar5.setBackgroundColor(Color.parseColor("#99ff99"));
            }


            TextView groupText = view.findViewById(R.id.groupText);
            TextView placeText = view.findViewById(R.id.placeText);

            HttpGetRequest getRequest5 = new HttpGetRequest();
            try {
                responsestr5 = getRequest5.execute("5", grouplist[position]).get();
            }
            catch (Exception e){

            }



            placeText.setText(responsestr5);
            groupText.setText(grouplist[position]);

            view.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View view)
                {
                    Intent intent = new Intent(view.getContext(), GroupActivity.class);
                    intent.putExtra("str0", username);
                    TextView groupText = view.findViewById(R.id.groupText);
                    intent.putExtra("str1", groupText.getText().toString());
                    startActivity(intent);
                }
            });

            return view;
        }
    }
}
