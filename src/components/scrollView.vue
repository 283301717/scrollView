<template>
  <div class="pageScroll" ref="pageScroll" @scroll="scroll($event)">
    <div class="scrollBox" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" :style='{"transform": "translate3d(0, "+top+"px, 0)"}'>
  	  <div class="pullBox">
        <div class="pullRefresh">
          <div class="spot" :style="{'width':spot+'px'}">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
  	  </div>
      <slot></slot>
      <div id="loading" v-show="status.loading"></div>
      <div class="_end" v-show="status.end">已经到底了</div>
    </div>
  </div>
</template>
<style lang="scss">
#loading{
  padding:25px 0px;
  text-align:center;
  background:url('../assets/loading.gif') no-repeat center;
  background-size: 28px;
}
.pageScroll{
  width: 100%;
  overflow-y: scroll;
  .scrollBox{
  	width: 100%;
    min-height:100%;
  	margin:-40px 0 0;
  	padding-top:40px;
    transition: all 0.2s linear 0s;
    position: relative;
  }
  .pullBox{
  	width: 100%;
  	transition:all .2s ease;
  	height:30px;
  	padding:10px 0px 0px;
  	position:absolute;
  	top:0px;
  	.pullRefresh{
  	  width: 100%;
  	  height: 100%;
  	  text-align:center;
  	  .spot{
  	  	width:10px;
  	  	height:100%;
  	  	margin:0px auto;
  	  	display:flex;
  	  	flex-direction:row;
        display:-webkit-flex;
        justify-content:space-around;
        align-items:center;
        transition: all 0.2s linear 0s;
        span{
          width:17.5%;
          height:0;
          padding-bottom:17.5%;
          display:inline-block;
  	  	  background: #bbb;
  	  	  border-radius: 50%;
  	  	  animation-delay:0s;
  	  	  animation-duration:0.9s;
  	  	  animation-iteration-count: infinite;
  	  	  animation-name:discolor;
          &:nth-child(2){
          	animation-delay:0.3s;
          }
          &:nth-child(3){
          	animation-delay:0.6s;
          }
        }
  	  }
  	}
  }
  ._end{font-size:12px;padding:13px 0px 15px;color:#999;text-align:center;}
}
@keyframes discolor {
  0%{
    opacity:0.9
  }
  50%{
    opacity:0.4
  }
  100%{
    opacity:0.9
  }
}
</style>
<script>
  export default {
    data: function() {
      return {
        startY: 0,       //触点开始位置
        endY: 0,         //触点结束位置
        scrollTop: 0,    //滚动距离
        scrollHeight: 0, //滚动区域高度
        height: 0,       //区域窗口高度
        threshold: 30,   //上拉距离底部多少触发
        top: 0,          //偏移距离
        spot: 10,        //点宽度
      }
    },
    props: ["onPullFresh", "onLoadMore", "status"],
    methods: {
      touchStart: function(e) {
        [this.state, this.startY] = ["start", e.touches[0].clientY]
      },
      touchMove: function(e) {
      	//var scrollTop = document.querySelector(".pageScroll").scrollTop
      	//
        const [scrollTop, endY, startY] = [this.scrollTop, e.touches[0].clientY, this.startY]
      	if(scrollTop>0) return
      	//e.preventDefault()

        //下拉
      	if(endY > startY) {
      	  const diff = endY - startY
      	  const top = Math.floor(diff / (1+(diff-80)/160))
          const spot = top-5;
          [this.top, this.spot] = [top>=500 ? 500:top, spot>40 ? 40:spot]
      	} else {
          //上拉
      	}
      },
      touchEnd: function(e) {
      	if(this.top > 80){
          this.top = 40
          setTimeout(this.onPullFresh,500)
      	}else{
          this.stopFresh()
      	}
      },
      stopFresh: function(){
        [this.top, this.spot] = [0, 10]
      },
      scroll: function(e) {
        const {scrollTop, scrollHeight} = e.target
      	if(scrollHeight != this.scrollHeight) this.scrollHeight = scrollHeight
      	if((this.scrollTop < scrollTop) && ((scrollTop + this.height) >= (this.scrollHeight - this.threshold))){
          this.onLoadMore()
      	}
        this.scrollTop = scrollTop
      }
    },
    watch: {
      //监听下拉状态
      "status.refresh" (to, from){
        if(!to){
          this.stopFresh()
        }
      }
    },
    mounted: function(){
      //this.height = document.querySelector(".pageScroll").offsetHeight
      
      //通过添加标签属性ref="pageScroll"再通过this.$refs来获取dom节点
      this.height = this.$refs.pageScroll.offsetHeight
    }
  }
</script>
