<template>
    <div id="app">
    
        <v-app id="inspire">
    
            <div class="text-xs-center">
    
                <v-dialog v-model="dialog" persistent overlay persistent width="300">
    
                    <v-card>
    
                        <v-card-text>
    
                            <div class="text-xs-center">Please wait . . .
    
                            </div>
    
                            <div class="text-xs-center">
    
                                <v-progress-circular :rotate="-90" :size="100" :width="15" :value="persen" color="primary">
    
                                    {{ persen }}
    
                                </v-progress-circular>
    
                            </div>
    
                        </v-card-text>
    
                    </v-card>
    
                </v-dialog>
    
            </div>
    
        </v-app>
    
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            interval: {},
            persen: 0,
            dialog: false
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    mounted() {
        this.interval = setInterval(() => {
            if (this.persen === 100) {
                return (this.persen = 0)
            }
            this.persen += 10
        }, 1000)
    },
    created() {
        if (this.value === true) return this.dialog = true
    },
    watch: {
        value() {
            console.log('this.value', this.value)
            if (this.value === true) return this.dialog = true
            return this.dialog = false
        },
    },
}
</script>
<style>
/* .v-progress-circular 
margin: 1rem */
</style>