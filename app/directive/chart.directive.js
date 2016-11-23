(function () {
    angular.module('app').directive('chart', chart);
    /* @ng-inject */
    function chart(types) {

        var labels = types.languages.map(lang=>lang.name);
        var chartTypes = {
            languages: function (data) {
                this.raw = data;
                this.data = {
                    datasets: [{
                        backgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#36A2EB", "#34495e"], label: '사용된 언어'
                    }],
                    labels: labels
                };
                this.type = 'doughnut';
                this.options = {
                    legend: {
                        position: 'bottom'
                    }
                };
                this.update = function () {
                    this.data.datasets[0].data = types.languages.map(lang=>this.raw[lang.language]);
                };
            },
            tags: function (data) {
                this.type = 'bar';
                this.options = {
                    legend: {
                        position: 'bottom'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }]
                    }
                };
                this.data = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: "참여한 문제",
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(179,181,198,1)",
                            borderWidth: 1,
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(179,181,198,1)",
                            data: data.size
                        },
                        {
                            label: "해결한 문제 (100%)",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            borderWidth: 1,
                            hoverBackgroundColor: "rgba(255,99,132,0.4)",
                            hoverBorderColor: "rgba(255,99,132,1)",
                            data: data.pass
                        }
                    ]
                };
            },
            levels: function (data) {
                data.labels.forEach((label, i)=> {
                    data.labels[i] = "lv." + label;
                });
                this.type = 'line';
                this.options = {
                    legend: {
                        position: 'bottom'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: Math.max.apply(null, data.size) + 1,
                                stepSize: 1,
                                stacked: true
                            }
                        }]
                    }
                };
                this.data = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: "참여한 문제",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(179,181,198,1)",

                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(179,181,198,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(179,181,198,1)",
                            pointHoverBorderColor: "rgba(179,181,198,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: data.size
                        },
                        {
                            label: "해결한 문제(100%)",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: data.pass
                        }
                    ]
                };
            }
        };


        return {
            scope: {
                data: '=',
                chart: '@'
            },
            restrict: 'A',
            link: function (s, e) {
                s.$watch('data', function (data) {
                    if (!data)
                        return;
                    if (!s.chartData || !s.chart) {
                        s.chartData = new chartTypes[s.chart](s.data);
                        if (s.chartData.update && typeof s.chartData.update === "function")
                            s.chartData.update();
                        s.chart = new Chart($(e), s.chartData);
                    }
                    if (s.chartData.update && typeof s.chartData.update === "function")
                        s.chartData.update();
                    s.chart.update();
                });
            }
        };
    }
})();