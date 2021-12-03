// const api_url = `http://localhost:8888/dashboard/GetDashSentiment`;
const api_url = `https://selindo.mendawai.com/apimendawai/dashboard/GetDashSentiment`;

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
            'Total: <b>{point.y} %</b><br/>'
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

    series: []
    /* series: [{
        name: 'sentiments',
        data: [{
            name: 'Positive',
            y: 0,
        }, {
            name: 'Negative',
            y: 0,
        }, {
            name: 'Neutral',
            y: 0,
        }]
    }] */
});

const SentimentTimeline = Highcharts.chart('sentiment_timeline', {
    title: {
        text: ''
    },
    xAxis: {
        type: 'category',
        crosshair: true
    },
    yAxis: [{ // Primary yAxis
        title: {
            text: 'No of Comments',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        labels: {
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Average Sentiment Score',
            style: {
                color: '#f7a35c'
            }
        },
        labels: {
            style: {
                color: '#f7a35c'
            }
        },
        opposite: true,
        crosshair: true
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

    series: []
    /* series: [{
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
        data: [9, 17, 13, 16, 13],
        marker: {
            lineWidth: 2,
            lineColor: '#f7a35c',
            fillColor: 'white'
        }
    }] */
});

async function dash_total() {
    const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"SentimentTotal",
            Periode: localStorage.getItem('periode')
		})
	}
	
	try {
		const res = await fetch(api_url, config);
		const obj = await res.json();
		const data = obj.data[0];

		if(obj.success){
			// console.log(obj)
			document.getElementById('total_comments').innerText = data.jumlah_comment;
			document.getElementById('total_users').innerText = data.jumlah_user;

            document.getElementById('periode_comments').innerText = `Total Comment : ${localStorage.getItem('periode')}`;
			document.getElementById('periode_users').innerText = `Total User : ${localStorage.getItem('periode')}`;
		}
	} 
	catch (error) {
		console.log(error);	
	}
}

async function dash_comments() {
    document.getElementById('periode_dash_comments').innerText = localStorage.getItem('periode');
    const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"SentimentComment",
            Periode: localStorage.getItem('periode')
		})
	}
	
	try {
		const res = await fetch(api_url, config);
		const obj = await res.json();
		const data = obj.data;
        // console.log(data);

		if(obj.success){
            for(var i = SentimentComments.series.length -1; i > -1; i--) {
				SentimentComments.series[i].remove();
			}

            let dataSeries=[];
			for(var i=0; i < data.length; i++){
				var sentiment = data[i].sentiment;
				var jumlah = parseInt( data[i].jumlah );
				var total = parseInt( data[i].total_sentiment );
                var persentase = (jumlah / total * 100);
				var color = '';
                // console.log(persentase);

                if (sentiment == 'Positive') {
                    color = '#22af47';
                    document.getElementById('total_positive').innerText = `${Number(persentase).toFixed(2)} %`;
                }
                else if(sentiment == 'Negative'){
                    color = '#f83f37';
                    document.getElementById('total_negative').innerText = `${Number(persentase).toFixed(2)} %`;
                }
                else if(sentiment == 'Neutral'){
                    color = '#1ebccd';
                    document.getElementById('total_neutral').innerText = `${Number(persentase).toFixed(2)} %`;
                }

                dataSeries.push({
                    name: sentiment, 
                    y: persentase,
                    color: color
                });
			}
            SentimentComments.addSeries({
                name: 'sentiments',
                data: dataSeries,

            });	
			SentimentComments.redraw();
		}
	} 
	catch (error) {
		console.log(error);	
	}
}


async function dash_timeline() {
    const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"SentimentTimeline",
            Periode: localStorage.getItem('periode')
		})
	}
	
	try {
		const res = await fetch(api_url, config);
		const obj = await res.json();
		const data = obj.data;
        // console.log(data);

		if(obj.success){
            for(var i = SentimentTimeline.series.length -1; i > -1; i--) {
				SentimentTimeline.series[i].remove();
			}

            //sum sentiment per key
            const sum_sentiment = data.reduce(function(arr, val){
                var o = arr.filter(function(obj){
                    return obj.Sentiment==val.Sentiment && obj.Waktu==val.Waktu;
                }).pop() || {Waktu:val.Waktu, Sentiment:val.Sentiment, JmlComment:0};
            
                o.JmlComment += Number(val.JmlComment);
                arr.push(o);
                return arr;
            },[]);

            //removing the duplicates:
            const result_sentiment = sum_sentiment.filter(function(item, i, a) {
                return i == a.indexOf(item);
            });

			for(var i=0; i < result_sentiment.length; i++){
                var waktu = result_sentiment[i].Waktu;
				var sentiment = result_sentiment[i].Sentiment;
				var jumlah = parseInt(result_sentiment[i].JmlComment);
                
				var color = '';
                if (sentiment == 'positive') {
                    color = '#22af47';
                }
                else if(sentiment == 'negative'){
                    color = '#f83f37';
                }
                else if(sentiment == 'neutral'){
                    color = '#1ebccd';
                }

                //? series sentiment
                SentimentTimeline.addSeries({
                    type: 'column',
                    name: sentiment,
                    data: [{
                        name: waktu,
                        y:jumlah
                    }],
                    color: color,
                    stack: 'sentiment'
                });
                
			}

            //sum score per key
            const sum_score = data.reduce(function(arr, val){
                var o = arr.filter(function(obj){
                    return obj.Waktu==val.Waktu;
                }).pop() || {Waktu:val.Waktu, Score:0};
            
                o.Score += Number(val.Score);
                arr.push(o);
                return arr;
            },[]);

            //removing the duplicates:
            const result = sum_score.filter(function(item, i, a) {
                return i == a.indexOf(item);
            });

            let dataSeries=[];
            for(var i=0; i < result.length; i++){
                dataSeries.push({
                    name:result[i].Waktu, 
                    y:(Number(result[i].Score) / 3)
                })
            }

            //? series score
            SentimentTimeline.addSeries({
                type: 'spline',
                name: 'Average Score',
                yAxis: 1,
                data: dataSeries,
                color: '#f7a35c',
                marker: {
                    symbol: 'circle',
                    lineWidth: 2,
                    lineColor: '#f7a35c',
                    fillColor: 'white'
                }
            }); 
			SentimentTimeline.redraw();
		}
	} 
	catch (error) {
		console.log(error);	
	}
}


function get_periode(value) {
    if (value === null) {
        localStorage.setItem('periode', 'today');
    }
    else{
        localStorage.setItem('periode', value);
    }

    dash_total();
    dash_comments();
    dash_timeline();
}
get_periode(localStorage.getItem('periode'));