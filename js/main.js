const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

//first frame is scatter plot
const FRAME1 = d3.select("#scatter1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame")
                    .attr("id", "svgScatter"); 

// Parse scatter plot data from csv
d3.csv("data/scatter-data.csv").then((data) => { 



  const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });
  const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.y); });

  const X_SCALE1 = d3.scaleLinear() 
                    .domain([0, (MAX_X1 + 1)]) // add some padding  
                    .range([0, VIS_WIDTH]); 

                    
                    //y scales down for max height
  const Y_SCALE1 = d3.scaleLinear() 
                    .domain([0, (MAX_Y1 + 1)]) // add some padding  
                    .range([VIS_HEIGHT, 0]);

  // add our circles with styling 
  FRAME1.selectAll("circle") 
      .data(data) 
      .enter()  
      .append("circle")
        .attr("cx", (d) => { return (X_SCALE1(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return ((Y_SCALE1(d.y)) + MARGINS.top); }) 
        .attr("r", 10)  
        .attr("fill", (d) => { return 'purple'; })
        .attr("class", "point");
        
        //add both axes
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE1).ticks(4)) 
          .attr("font-size", '20px'); 

  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.top + 
              "," + (MARGINS.left) + ")") 
        .call(d3.axisLeft(Y_SCALE1).ticks(4)) 
          .attr("font-size", '20px'); 

}); 




// second frame is bar plot
const FRAME2 = d3.select("#bar1")
                .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame"); 



                    
       
                    

function create_bar_plot() {
                    d3.csv("data/bar-data.csv").then((data) => {
                
                        // Scales and Axes
                        const X_SCALE = d3.scaleBand() // for categorical data 
                                            .range([0, VIS_WIDTH])
                                            .domain(data.map(d => d.category))
                                            .padding(0.2); 
                        
                        FRAME2.append("g")
                                .attr("transform", "translate(" + MARGINS.left +
                                    "," + (VIS_HEIGHT + MARGINS.top) + ")")
                                .call(d3.axisBottom(X_SCALE));  
                
                        
                        const Y_SCALE = d3.scaleLinear()
                                            .domain([0, 100])
                                            .range([VIS_HEIGHT, 0]); 
                
                        
                        FRAME2.append("g")
                                .attr("transform", "translate(" + MARGINS.left +
                                    "," + MARGINS.top + ")")
                                .call(d3.axisLeft(Y_SCALE));  
                
                        
                                // Add svg rects for each bar
                        FRAME2.selectAll("bars")
                                .data(data)
                                .enter()
                                .append("rect")
                                    .attr("x", (d) => { 
                                        return (X_SCALE(d.category) + MARGINS.left); 
                                    })
                                    .attr("y", (d) => {
                                         
                                        return (Y_SCALE(d.amount) + MARGINS.top);
                                    })
                                    .attr("height", (d) => {
                                        return (VIS_HEIGHT - Y_SCALE(d.amount));
                                    })
                                    .attr("width", X_SCALE.bandwidth())
                                    .attr("class", "bar"); 




// create new tooltip to overlay on bar plot
    const TOOLTIP = d3.select("#bar1")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Make tooltip appear on mouseover
    function handleMouseOver(event, d) {
      
      TOOLTIP.style("opacity", 1); 
      
    }


    // offset tooltip from mouse position
    function handleMouseMove(event, d) {
        let xpos = (event.pageX + 10);
        let ypos = (event.pageY - 50); 
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
            .style("top", ypos + "px")
            .style("left", xpos + "px"); 
               
    }

    // disappear after
    function handleMouseLeave(event, d) { 
      TOOLTIP.style("opacity", 0); 
    } 

    //apply event handlers
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseOver) 
          .on("mousemove", handleMouseMove)
          .on("mouseleave", handleMouseLeave);    

                    })

                }


create_bar_plot();

//Easier to run after the page has loaded
window.onload=function(){
let points = document.getElementsByClassName("point");

function clickpt() {
        let xval = this.cx;
        let yval = this.cy;
        // Add the coordinates of the last clicked point (this point)
        let coords = '(' + ((xval.baseVal.value - 50) / 40) + ', ' + ((450 - (yval.baseVal.value)) / 40) + ')';
        document.getElementById('lastClicked').innerHTML = 'Last Point Clicked: ' + coords;
        // Adds or removes a border for this circle based on current border status
        if (this.classList.contains('bord')) {
            this.classList.remove('bord');
        } else {
            this.classList.add('bord');
        }
    }


function createPoint() {
        //Inserts new <circle> tag based on inputs
        let xCoord = document.getElementById('xSelect');
        let yCoord = document.getElementById('ySelect');
        let prevText = document.getElementById("svgScatter").innerHTML;
        let xval1 = parseInt(xCoord.options[xCoord.selectedIndex].text);
        let yval1 = parseInt(yCoord.options[yCoord.selectedIndex].text);
        let newCirc = '<circle class="point" cx="' + ((xval1 * 40) + 50) + '" cy="' + (450 - (yval1 * 40)) + '" r="10"/>';
        let fullImg = prevText + newCirc;
        document.getElementById('svgScatter').innerHTML = fullImg;

        //Readds the event listener to the new circle
        for (var i = 0; i < points.length; i++) {
            points[i].addEventListener('click', clickpt);
        }

    }

    document.getElementById("inputButton").addEventListener('click', createPoint);

// apply event handlers for each point
for (var i = 0; i < points.length; i++) {
        points[i].addEventListener('click', clickpt);
    }
  }