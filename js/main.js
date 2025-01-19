// Hint: This is a great place to declare your global variables
var female_data;
var male_data;
var svg, width, height, margin;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
    margin = {top: 20, right: 30, bottom: 40, left: 60};
    width = 1000 - margin.left - margin.right;
    height = 600 - margin.top - margin.bottom;

    svg = d3.select('svg')
       .attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom)
       .append('g')
       .attr('transform', `translate(${margin.left},${margin.top})`);
   // This will load your CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('Loaded the females_data.csv and males_data.csv');
            female_data = numData(values[0]);
            male_data = numData(values[1]);

            
            drawLolliPopChart(d3.select('#selectCountry').property('value'));
        });

    d3.select('#selectCountry').on('change', function () {
        const selectedCountry = d3.select(this).property('value');
        drawLolliPopChart(selectedCountry);
    });


    function numData(data){
        let processedData = [];
        data.forEach(function(row) {
            const Year = new Date(+row.Year, 0, 1);

            for (const country in row){
                if(country !== 'Year'){
                    processedData.push({
                        country: country,
                        Year: Year,
                        employment: +row[country]
                    });
                }
            }
        });
        return processedData;
    }

// Use this function to draw the lollipop chart.
    function drawLolliPopChart(country) {
        console.log('trace:drawLolliPopChart ', country);

        svg.selectAll('*').remove();

        const female_filtered = female_data.filter(d => d.country === country);
        const male_filtered = male_data.filter(d => d.country === country);

        const xScale = d3.scaleTime()
            .domain([new Date(1990, 0, 1), new Date(2023, 0, 1)]) 
            .range([0, width]);

        const maxEmploymentRate = d3.max([...female_filtered, ...male_filtered], d => d.employment);
        const yScale = d3.scaleLinear()
            .domain([0, maxEmploymentRate]) 
            .range([height, 0]);

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')));

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        svg.append('text')
            .attr('class', 'x-axis-label')
            .attr('text-anchor', 'end')
            .attr('x', width - 450)
            .attr('y', height + 40)
            .style('font-weight', 'bold')
            .text('Year');

        svg.append('text')
            .attr('class', 'y-axis-label')
            .attr('text-anchor', 'end')
            .attr('x', -200)
            .attr('y', -45)
            .attr('transform', 'rotate(-90)')
            .style('font-weight', 'bold')
            .text('Employment Rate');

        svg.selectAll('.male-lollipop')
            .data(male_filtered)
            .enter()
            .append('line')
            .attr('x1', d => xScale(d.Year) - 5)
            .attr('x2', d => xScale(d.Year) - 5)
            .attr('y1', yScale(0))
            .attr('y2', d => yScale(d.employment))
            .attr('stroke', 'green')
            .attr('stroke-width', 2);

        svg.selectAll('.male-circle')
            .data(male_filtered)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.Year) - 5)
            .attr('cy', d => yScale(d.employment))
            .attr('r', 5)
            .attr('fill', 'green');

        svg.selectAll('.female-lollipop')
            .data(female_filtered)
            .enter()
            .append('line')
            .attr('x1', d => xScale(d.Year) + 5)
            .attr('x2', d => xScale(d.Year) + 5)
            .attr('y1', yScale(0))
            .attr('y2', d => yScale(d.employment))
            .attr('stroke', 'magenta')
            .attr('stroke-width', 2);

        svg.selectAll('.female-circle')
            .data(female_filtered)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.Year) + 5)
            .attr('cy', d => yScale(d.employment))
            .attr('r', 5)
            .attr('fill', 'magenta');

            const legend = svg.append('g')
            .attr('transform', `translate(${width - 200}, 0)`);

        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', 'green');

        legend.append('text')
            .attr('x', 30)
            .attr('y', 15)
            .style('font-weight', 'bold')
            .text('Male Employment Rate');

        legend.append('rect')
            .attr('x', 0)
            .attr('y', 30)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', 'magenta');

        legend.append('text')
            .attr('x', 30)
            .attr('y', 45)
            .style('font-weight', 'bold')
            .text('Female Employment Rate');   
    }
});

