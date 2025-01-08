Securin - NVD - Assessment:
Basic Logic approach to the problem statement:
From the NVD , I have used MongoDB to store the data batchwise using pagination functionality. As mongoose required validation and certain Data from NVD were missing certain values, I decided to use MongoDB directly.
After fetching CVE details from NVD, I created a function to insert the CVE details into my database. 
I created various endpoints to satisfy the problem statement.

How will I keep the database and NVD synchronized?
I will use setInterval fucntion to call my db file which contains the database code, on a regular interval so that it keeps being in sync with the NVD's real time data. This is one way to do it.
Hence, I created a fully functional Backend system for the given problem statement. 
ScreenShot of the UI:
![image](https://github.com/user-attachments/assets/0318d289-95eb-4e87-a70a-ebffeacb9f38)

Overall Approach:
1. Create a DB
2. Fetch CVE details from NVD
3. Insert into created DB
4. Create endpoints for satisfying the given queries
5. Create UI


