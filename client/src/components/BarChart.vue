<template>
    <div class="chart">
        <v-tooltip bottom v-for="bar in chartBars" :key="bar.state">
            <template v-slot:activator="{ on }">
                <div v-on="on" class="chartbar" :style="{width: bar.size + '%', 'background-color': bar.color}"></div>
            </template>
            <span>{{bar.message}} {{bar.count}} / {{total}}</span>
        </v-tooltip>
    </div>
</template>

<script>
import backend from '../backend'
export default {
    props: {
        productdata: {type: Object, required: true},
        account: {type: Object, required: true}
    },
    data() {
        return {
            colors: {
                ProductInit: "grey",
                ProductReceived: "grey",
                ProductDev: "#0e6ab5",
                ProductMissing: "#c91463",
                ProductQAMissing: "#ad239b",
                ProductReview: "#1496c9",
                ProductRefine: "#0e6ab5",
                ClientProductReceived: "#37db4d",
                ClientFeedback: "#0e6ab5",
                Done: "green",
                Error: "red"
            },
            clientcolors: {
                ProductInit: "grey",
                ProductReceived: "grey",
                ProductDev: "#0e6ab5",
                ProductMissing: "#0e6ab5",
                ProductQAMissing: "#ad239b",
                ProductReview: "#0e6ab5",
                ProductRefine: "#0e6ab5",
                ClientProductReceived: "#37db4d",
                ClientFeedback: "#0e6ab5",
                Done: "green",
                Error: "red"
            }
        };
    },
    computed: {
        total() {
            var sum = 0;
            Object.values(this.productdata).forEach(state => {
                sum += parseInt(state.count);
            })
            
            return sum
        },
        chartBars() {
            var ret = {}
            var sum = 0;
            var states =  Object.values(this.productdata)
            states.forEach(state => {
                sum += parseInt(state.count);
            })
            states.forEach(state => {
                var message = backend.messageFromStatus(state.stateafter, this.account.usertype);
                if(!ret[message]) {
                    ret[message] = {
                        message: message,
                        color: this.colorFromAccount(state.stateafter),
                        count: 0,
                        state: state.stateafter,
                    }
                }
                ret[message].count += parseInt(state.count);
            })

            ret = Object.values(ret);
            ret.forEach(state => {
                state.size = (100 / sum) * parseInt(state.count);
            })

            ret.sort((a,b) => {
                if ( a.color < b.color ){
                    return -1;
                }
                if ( a.color > b.color ){
                    return 1;
                }
                return 0;
            });
            return ret;
        }
    },
    methods: {
        colorFromAccount(state) {
            if(this.account.usertype == 'Client') {
                return this.clientcolors[state]
            }
            return this.colors[state]
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}
.chartbar {
    display: block;
    height: 10px;
}
</style>