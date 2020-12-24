<template>
  <div class="container">
    <scroll-view class="newsList bdbox" :onPullFresh="onPullDownRefresh" :onLoadMore="onReachBottom" :status="status">
      <ul>
        <li v-for="item in infoList" class="borderb">
          <span>{{item.dt}}</span> 
          {{item.title}} 
        </li>
      </ul>
    </scroll-view>
  </div>
</template>
<style lang="scss">
  @import '@/scss/base/mixins';
  .container{
    height:100%;
    .newsList{
      padding:2px 12px 0px;
      width:100%;
      height:100%;
      li{
        padding:11px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        font-size:15px;
        text-align:left;
        span{
          color:#999;
          width:52px;
          float:left;
        }
      }
    }
  }
</style>
<script>
import scrollView from './scrollView'
export default {
  data () {
    return {
      infoList: [],
      pages: 0,
      end: false,
      status: { loading: false, refresh: false, end: false }
    }
  },
  components: { scrollView },
  methods: {
    getData: function(act, page) {
      const that = this
      let [_infoList, datas, res] = [that.infoList, {act: "list", pages: that.pages, pageSize: 20}, require('../json/data.json')]

      if(page > 3) res = []
      let infoArr = res.data || []
      if(act == "more") { //load more
        if(infoArr.length > 0) {
          [_infoList, that.page] = [_infoList.concat(infoArr), page]
        } else {
          [that.end, that.status.end] = [true, true]
        }
        that.$set(that.status, "loading", false)
      } else { //refresh
        if(infoArr.length > 0) that.pages = page
        _infoList = infoArr
        this.$nextTick(function() {
          that.$set(that.status, "refresh", false)
          that.$set(that.status, "end", false)
          that.end = false
        })
      }
      that.$set(that, "infoList", _infoList)
    },
    //下拉刷新
    onPullDownRefresh: function(e) {
      if(this.status.refresh) return
      this.$set(this.status, "refresh", true)
      this.getData("refresh", 1)
    },
    //加载更多
    onReachBottom: function(e) {
      const that = this
      if(this.end[this.nid] === true || this.status.loading) return
      this.$set(this.status, "loading", true)
      setTimeout(function() {
        that.getData("more", that.pages+1)
      }, 1000)
    }
  },
  created: function() {
    this.getData("first",1);
  },
  mounted: function() {
  }
}
</script>
