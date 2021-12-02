# Scheduler

## Introduction

This is a scheduler made with Typescript, Spring Boot, Spring Security, JWT, Bulma and some custom CSS.

As a user you start with accessing the login page and use the [User Info](#user-info) to login to scheduler.



**!: First time you try to login, you will need to wait for the server to start!**

​	

## User Info

```md
username: user
password: user
```

```md
username: user2
password: user2
```

```md
username: user3
password: user3
```

## Functionality

![image-20211202213209555](./assets/images/site)

### Calender <prev,next>

![image-20211202213332619](assets/images/prev-next-buttons)

These button will move  past or forward one week


### Log Out

![image-20211202213423141](assets/images/logut-button)

Log out button, you will be redirected to the login screen  and require to login again.

### Add Event

![image-20211202213454538](./assets/images/time-table)

When you click on this element a modal will open up. Were you can input the necessary information to create an event for your user.

*Validation: 
-some fields are required.
-overlapping date & time will not work.
-needs to be within 0400-2559.
-star time needs to be before end time.*

*all these should have validation messages when you submit info.*

### Event Info

![image-20211202213559000](./assets/images/event)

Click and a modal will open up with event info.




## Reflection

Was a fun project to work on. Something that I noticed with the frontend was that I was lacking a lot when it comes to the structure of code. Compared  to using React, it's hard to 'naturally' structure the code with just JS/TS. Something that I need to think about in future projects. Learned a lot when it comes to identifying the problem, break it down and rephrase it into something that is 'googleable'.  More cohesive error handling instead of just returning a status code.

Was using Parcel as my bundler and had some unique problems when it came to how my code was running locally compared to  my prod env.

Overall really appreciate the experience!

#### Things To Work On: 

Here is some things that either could be worked on or added during time.

## Frontend

#### Validation

- [ ] date format
- [ ] time format
- [ ] min/max field values

#### Style

- [ ] event modal styling

#### Functionality

- [ ] delete event

- [ ] registration page

- [ ] change so {month} isn't based on Monday instead current date

  


------------------

## Backend

#### Validation

- [ ] date format
- [ ] time format
- [ ] min/max field values

#### Error Handling

- [ ] implement more exception handling handling with @ControllerAdvice

#### Testing

- [ ] add unit tests
- [ ] add integration tests

#### Other

- [ ] DTO implementation
