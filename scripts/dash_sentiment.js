const SentimentOverall = Highcharts.chart('sentiment_overall', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: 300,
        width: 300,
    },
    title: {
        text: 'Browser<br>shares',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '100%'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '70%',
        data: [
            ['Chrome', 58.9],
            ['Firefox', 13.29],
            ['Internet Explorer', 13]
        ]
    }]
});

const SentimentComments = Highcharts.chart('sentiment_comments', {
    chart: {
        type: 'pie',
        height: 300,
        width: 300,
    },
    title: {
        text: 'Sentiment <br> Breakdown',
        align: 'center',
        verticalAlign: 'middle',
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
            'Comments: <b>{point.y} %</b><br/>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            center: ['50%', '50%'],
            size: '100%',
            innerSize: '80%',
        }
    },
    credits: {
        enabled: false
    },

    series: [{
        name: 'sentiments',
        data: [{
            name: 'Positive',
            y: 60,
        }, {
            name: 'Negative',
            y: 30,
        }, {
            name: 'Neutral',
            y: 10,
        }]
    }]
});

const SentimentTimeline = Highcharts.chart('sentiment_timeline', {
    title: {
        text: 'Combination chart'
    },
    xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
    },
    yAxis: [{ // Primary yAxis
        title: {
            text: 'No of Comments',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        labels: {
            // format: '{value}°C',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Average Sentiment Score',
            style: {
                color: Highcharts.getOptions().colors[3]
            }
        },
        labels: {
            // format: '{value} mm',
            style: {
                color: Highcharts.getOptions().colors[3]
            }
        },
        opposite: true
    }],
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },

    series: [{
        type: 'column',
        name: 'Jane',
        data: [3, 2, 1, 3, 4],
        stack: 'male'
    }, {
        type: 'column',
        name: 'John',
        data: [2, 3, 5, 7, 6],
        stack: 'male'
    }, {
        type: 'column',
        name: 'Joe',
        data: [4, 3, 3, 9, 0],
        stack: 'male'
    }, {
        type: 'spline',
        name: 'Average',
        data: [9, 17, 13, 16.33, 13.33],
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
        }
    }]
});

async function dash_timeline() {

}
dash_timeline()