<template>
    <div id="dataview" class="dataview">
        <div class="box">
            <div class="column1">
                <div class="block">
                    <div id="myChart" style="width: 100%; height: 100%"></div>
                </div>
                <div class="block">
                    <div id="pie" style="width: 100%; height: 100%"></div>
                </div>
            </div>
            <div class="column2">
                <div class="header">狸知 Ahriknow</div>
                <div class="middle">
                    <div id="map" style="width: 100%; height: 100%"></div>
                </div>
                <div class="footer">
                    <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                    <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
                    <router-link to="/auth/register">Sign up</router-link>&nbsp;|&nbsp;
                    <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
                    <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                    <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                    <router-link to="/transfer/galaxy">Transfer</router-link>&nbsp;|&nbsp;
                    <router-link v-if="user.role == 100" to="/setting/user">UserManage</router-link>
                </div>
            </div>
            <div class="column3">
                <div id="bar" style="width: 100%; height: 100%"></div>
            </div>
        </div>
    </div>
</template>

<script>
// import '../../node_modules/echarts/map/js/world.js'
// import "../../node_modules/echarts/map/js/china.js";
export default {
    name: "dataview",
    data() {
        var dataAxis = ["20", "21", "22", "23", "24", "25", "26"];
        var data = [160, 134, 150, 234, 210, 252, 277];
        var yMax = 500;
        var dataShadow = [];

        for (var i = 0; i < data.length; i++) {
            dataShadow.push(300);
        }
        return {
            user: {
                role: 0
            },
            ws: {},
            data: {
                time: 0
            },
            msg: "Welcome to Your Vue.js App",
            options: {
                title: {
                    text: "内存占用",
                    textStyle: {
                        color: "#fff9"
                    },
                    left: "center"
                },
                series: [
                    {
                        name: "内存占用",
                        type: "gauge",
                        splitNumber: 10,
                        radius: "80%",
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [0.2, "lime"],
                                    [0.8, "#1e90ff"],
                                    [1, "#ff4500"]
                                ],
                                width: 3
                            }
                        },
                        splitLine: {
                            length: 25,
                            lineStyle: {
                                width: 3,
                                color: "#fff",
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                fontWeight: "bolder",
                                color: "#fff",
                                shadowColor: "#fff",
                                shadowBlur: 10
                            }
                        },
                        axisTick: {
                            length: 15,
                            lineStyle: {
                                color: "auto",
                                shadowColor: "#000",
                                shadowBlur: 10
                            }
                        },
                        pointer: {
                            shadowColor: "#fff",
                            shadowBlur: 5
                        },
                        title: {
                            textStyle: {
                                fontWeight: "bolder",
                                fontSize: 20,
                                fontStyle: "italic",
                                color: "#fff",
                                shadowColor: "#fff",
                                shadowBlur: 10
                            }
                        },
                        detail: { formatter: "{value}%" },
                        data: [{ value: 18, name: "内存占用" }]
                    }
                ]
            },
            myChart: {},
            city: [
                { name: "北京", value: "100" },
                { name: "天津", value: 100 },
                { name: "上海", value: 100 },
                { name: "重庆", value: 100 },
                { name: "河北", value: 100 },
                { name: "河南", value: 100 },
                { name: "云南", value: 100 },
                { name: "辽宁", value: 100 },
                { name: "黑龙江", value: 100 },
                { name: "湖南", value: 100 },
                { name: "安徽", value: 100 },
                { name: "山东", value: 100 },
                { name: "新疆", value: 100 },
                { name: "江苏", value: 100 },
                { name: "浙江", value: 100 },
                { name: "江西", value: 100 },
                { name: "湖北", value: 100 },
                { name: "广西", value: 100 },
                { name: "甘肃", value: 100 },
                { name: "山西", value: 100 },
                { name: "内蒙古", value: 100 },
                { name: "陕西", value: 100 },
                { name: "吉林", value: 100 },
                { name: "福建", value: 100 },
                { name: "贵州", value: 100 },
                { name: "广东", value: 100 },
                { name: "青海", value: 100 },
                { name: "西藏", value: 100 },
                { name: "四川", value: 100 },
                { name: "宁夏", value: 100 },
                { name: "海南", value: 100 },
                { name: "台湾", value: 100 },
                { name: "香港", value: 100 },
                { name: "澳门", value: 100 }
            ],
            optionMap: {
                title: {
                    text: "用户分布",
                    subtext: "",
                    x: "center",
                    textStyle: {
                        color: "#fff9"
                    }
                },
                tooltip: {
                    trigger: "item"
                },
                visualMap: {
                    show: true,
                    x: "left",
                    y: "center",
                    textStyle: {
                        color: "#ffffff00"
                    },
                    splitList: [
                        { start: 700, end: 800 },
                        { start: 600, end: 700 },
                        { start: 500, end: 600 },
                        { start: 400, end: 500 },
                        { start: 300, end: 400 },
                        { start: 200, end: 300 },
                        { start: 100, end: 200 },
                        { start: 0, end: 100 }
                    ],
                    color: [
                        "rgba(200,0,255,0.8)",
                        "rgba(150,20,255,0.8)",
                        "rgba(100,40,255,0.8)",
                        "rgba(50,60,255,0.8)",
                        "rgba(90,90,255,0.8)",
                        "rgba(120,120,255,0.8)",
                        "rgba(160,160,255,0.8)",
                        "rgba(200,200,255,0.8)"
                    ]
                },
                series: [
                    {
                        name: "数据",
                        type: "map",
                        mapType: "china",
                        roam: true,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        data: [
                            { name: "北京", value: 600 },
                            { name: "天津", value: 500 },
                            { name: "上海", value: 345 },
                            { name: "重庆", value: 234 },
                            { name: "河北", value: 100 },
                            { name: "河南", value: 100 },
                            { name: "云南", value: 100 },
                            { name: "辽宁", value: 234 },
                            { name: "黑龙江", value: 234 },
                            { name: "湖南", value: 234 },
                            { name: "安徽", value: 123 },
                            { name: "山东", value: 100 },
                            { name: "新疆", value: 32 },
                            { name: "江苏", value: 234 },
                            { name: "浙江", value: 234 },
                            { name: "江西", value: 100 },
                            { name: "湖北", value: 325 },
                            { name: "广西", value: 43 },
                            { name: "甘肃", value: 100 },
                            { name: "山西", value: 123 },
                            { name: "内蒙古", value: 100 },
                            { name: "陕西", value: 100 },
                            { name: "吉林", value: 222 },
                            { name: "福建", value: 333 },
                            { name: "贵州", value: 153 },
                            { name: "广东", value: 700 },
                            { name: "青海", value: 32 },
                            { name: "西藏", value: 32 },
                            { name: "四川", value: 32 },
                            { name: "宁夏", value: 32 },
                            { name: "海南", value: 32 },
                            { name: "台湾", value: 223 },
                            { name: "香港", value: 145 },
                            { name: "澳门", value: 154 },
                            { name: "南海诸岛", value: 10 }
                        ]
                    }
                ]
            },
            map: {},
            bar: {},
            optionBar: {
                title: {
                    text: "一周内用户访问量",
                    textStyle: {
                        color: "#fff9"
                    },
                    left: "center"
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: true,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#999"
                        }
                    }
                },
                dataZoom: [
                    {
                        type: "inside"
                    }
                ],
                series: [
                    {
                        type: "bar",
                        itemStyle: {
                            normal: { color: "rgba(0,0,0,0.05)" }
                        },
                        barGap: "-100%",
                        barCategoryGap: "40%",
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: "bar",
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        { offset: 0, color: "#83bff6" },
                                        { offset: 0.5, color: "#188df0" },
                                        { offset: 1, color: "#188df0" }
                                    ]
                                )
                            },
                            emphasis: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        { offset: 0, color: "#2378f7" },
                                        { offset: 0.7, color: "#2378f7" },
                                        { offset: 1, color: "#83bff6" }
                                    ]
                                )
                            }
                        },
                        data: data
                    }
                ]
            },
            pie: {},
            optionPie: {
                title: {
                    text: "用户访问模块频率",
                    textStyle: {
                        color: "#fff9"
                    },
                    left: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: "常用模块",
                        type: "pie",
                        radius: ["50%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "20",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            { value: 335, name: "Notebook" },
                            { value: 510, name: "Ahridata" },
                            { value: 234, name: "Transfer" },
                            { value: 135, name: "Ahriblog" },
                            { value: 154, name: "Dialog" }
                        ]
                    }
                ]
            }
        };
    },
    created() {},
    methods: {
        drawLine() {
            this.myChart = this.$echarts.init(
                document.getElementById("myChart")
            );
            this.myChart.setOption(this.options, true);
            this.map = this.$echarts.init(document.getElementById("map"));
            this.map.setOption(this.optionMap, true);
            this.bar = this.$echarts.init(document.getElementById("bar"));
            this.bar.setOption(this.optionBar, true);
            this.pie = this.$echarts.init(document.getElementById("pie"));
            this.pie.setOption(this.optionPie, true);
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        }
        this.drawLine();
        let self = this;
        if ("WebSocket" in window) {
            // 打开一个 web socket
            this.ws = new WebSocket("wss://aaahri.com/dataview/");
            this.ws.onopen = function() {
                // Web Socket 已连接上，使用 send() 方法发送数据
                // ws.send("123");
            };
            this.ws.onmessage = function(evt) {
                var received_msg = evt.data;
                // console.log(received_msg);
                self.data = JSON.parse(evt.data);
                self.options.series[0].data[0].value = parseInt(
                    JSON.parse(evt.data).syl
                );
                self.myChart.setOption(self.options, true);
                // self.map.setOption(self.optionMap, true);
            };
            let self = this;
            this.ws.onclose = function() {
                self.ws.send("close");
            };
            window.onresize = () => {
                this.myChart.resize();
                this.map.resize();
                this.bar.resize();
                this.pie.resize();
            };
        } else {
            alert("您的浏览器不支持 WebSocket!");
        }
    },
    beforeRouteLeave(to, from, next) {
        try {
            this.ws.close();
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#dataview {
    width: 100%;
    height: 100%;
    background-image: url("../assets/star.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    .box {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 26% 48% 26%;
        .column1 {
            .block {
                height: 46%;
                padding: 30px;
            }
        }
        .column2 {
            padding: 0 50px;
            .header {
                height: 20%;
                font-size: 60px;
                font-weight: bold;
                text-align: center;
                line-height: 200px;
                color: #fff8;
            }
            .middle {
                height: 60%;
            }
            .footer {
                height: 20%;
                width: 100%;
                line-height: 50px;
                text-align: center;
                padding: 0 30px;
                a {
                    font-weight: bold;
                    color: #fff8;
                    &.router-link-exact-active {
                        color: #42b983;
                    }
                }
            }
        }
        .column3 {
            height: 100%;
        }
    }
}
</style>