## The Problem: 
In my student organizations at TAMU, we often need to have people go on campus and advertise for our events. Because we are volunteer organizations, it is sometimes hard to get people to sign up for shifts. Currently, the tool that evryone uses to schedule people is a massive spreadsheet. The problem is that assigning people manually can be a lot of work, and there is another problem that people don't get the shifts that they want. Also, when doing it manually, you have to consider whether or not people can work shifts that you schedule them for, due to classes and other obligations. My scheduler aims to solve all of these problems.  

## The Build: 
In this project, there are four main parts: the frontend, the backend, the database, and the constraint solver. For the frontend, I chose React after looking at several frontend options like, Angular, Jade, and the standard HTML/CSS/JS option. After doing some research, I decided on react because of its growing popularity, its scalability, and its simplicity. Before this project, I didn't know React, but now I have a good grasp of it. For the backend, I chose the Python Flask framework because I already had a lot of experience with it, as I used it for developing microservices during my internship at Ericsson. As far as the database, I used sqlite3, due to its lightweight and also because it was free. If I were to take the application commercial, I would opt for a paid and more secure database alternative. Lastly, I had to select a constraint solver. I initially was going to use the Optaplanner constraint solver, however when I thought about the problem I was trying to solve, I realized that my solution didn't require all of the features of Optaplanner. I ended up looking around and found Google's OR Tools constraint solver, which was simpler to set up and didn't have too many feature that I didn't need. Also, I was able to use a python version of OR Tools, so I could integrate pretty easily with Flask.  How it works: The first screen is the employee tab. Here you can add all of your employees/volunteers into the system, where they are saved in the DB.   The next screen is the shift tab. Here you can add all of your shifts into the system, where they are saved in the DB. In this screen, the shifts are shown in a calendar view.   The next screen is the schedule requests tab. Here you can add all of your employees'/volunteers' requests into the system(whether they want to work a shift or they can't work shift), where they are saved in the DB.   Lastly, there is a schedule tab. This is the place where everything comes together. It has a table with all of the shifts and when the schedule button is pressed, it fills them with employees(in the assigned employee(s) column. 


## Future Plans: 
As of right now, all of the functionality I intended to add is working, however I do still plan to add small updates in the future. Also, I am looking into places to host it and it should be available soon.


## To Run:
Install npm packages with '$npm i'

Start Client with '$npm start'

Start Server with '$flask run'
