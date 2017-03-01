#  Age of Tomorrow App


## Synopsis:
The motivation behind this project was to showcase the technology of tomorrow. In this project, I tapped into
the Internet of Things and discover my limitation to programming devices was no longer a limitation. Welcome
to Javascript Robotics.  Of course, ideally I still want to learn C++ and C but for now, I get to practice
programming devices with plain old javascript. 


![Alt text](./src/assets/ScreenshotNiteOut.png "Picture of Nite Out")



## Code Example
```` ``` ````Cylon.JS/Javascript```` ``` ````
  deleteActivity(key){

let precaution = confirm("Are you sure your plans have been cancelled? ")
if(precaution){
axios.delete(`https://date-night-alive.firebaseio.com/${key}.json?print=pretty`)
.then(() => {
    this.getActivities();
    console.log(key);
   })
   .catch((error) => {console.log(error)
 })
}
}
  ```` ``` ````

## Build Strategy
Originally I wanted to build a nite-out application where you can schedule your daily activities and only have 5 activities per page.  My first step was to setup a firebase database to store my information and setup structure for project. From there, I wrote the logic to get the date in the format that I wanted so that it could render succesfully on the page. Originally, I wanted to test my skill with ReactJS and only write code in Vanilla Javascript/ ReactJS.  Yet, I used lodash for some parts
 and will work on adding more to application 



## Technologies

For this project, I have used the following technologies:

ReactJS
Firebase
Axios
Lodash
Vanilla Javacript
HTML
CSS
GitHub

## Future Improvements (not in any particular order)

1.) add Browser Router so I can have a navigation history for users
2.) add a Date component so users can see activities by date
3.) Add an expansion feature where it links to the Google API so a map can display when you click expand
4.) Add a sort functionality to organize activities by time within each date



## Contributing
Stack Overflow 
W3 Schools
ReactJS Documentation
Lodash Documentation
These resources really help with my syntax issues. 

##Authors
Shantel Moore
