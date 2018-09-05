<template>
	<div>
		<el-dialog
			title="选择地图坐标"
			:visible.sync="showMapComponent"
			:close-on-click-modal="false"
            :close-on-press-escape="false"
			:append-to-body="true"
			width="50%"
			:before-close="cancel">
			<baidu-map :style="mapStyle" class="bm-view"
				@ready="handleMapDone"
				:center="center"
				:zoom="zoom"
				:scroll-wheel-zoom="true"
				@click="getClickInfo"
				@moving="syncCenterAndZoom"
				@moveend="syncCenterAndZoom"
				@zoomend="syncCenterAndZoom">
				<bm-view style="width: 100%; height:500px;"></bm-view>
				<bm-marker :position="{lng: center.lng, lat: center.lat}" :icon="{url: 'http://img5.farmeasy.cn/acsm-yp/00000001/staff/20180904/153604010016577bb4.png', size:{width:20, height: 40}}">
				</bm-marker>
				<bm-control :offset="{width: '10px', height: '10px'}">
					<bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
						<input type="text" placeholder="请输入关键字" class="serachinput">
					</bm-auto-complete>
				</bm-control>
				<bm-local-search @searchcomplete="searchcomplete" :keyword="keyword" :auto-viewport="true"  style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
				<!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
			</baidu-map>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel" size="small">取 消</el-button>
				<el-button type="primary" @click="confirm" size="small">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
    import { deepClone } from '@/utils'
    export default {
		props: [
			'value',
			'mapHeight',
			'dCenter'
		],
        data() {
			return {
				showMapComponent: this.value,
				keyword: '',
				mapStyle: {
					width: '100%',
					height: this.mapHeight + 'px'
				},
				center: {lng: 116.404, lat: 39.915},
        		zoom: 15
			}
		},
		watch: {
			value: function (currentValue) {
				this.showMapComponent = currentValue
				if (currentValue) {
				this.keyword = ''
				}
			}
		},
		methods: {
			handleMapDone() {
				// 每次都赋值
				this.center = this.dCenter ? deepClone(this.dCenter) : {lng: 116.404, lat: 39.915};
			},
			/***
			* 地图点击事件。
			*/
			getClickInfo (e) {
				console.log(e)
				this.center.lng = e.point.lng
				this.center.lat = e.point.lat
			},
			syncCenterAndZoom (e) {
				const {lng, lat} = e.target.getCenter()
				if( typeof this.center == 'string' ) this.center = {};
				this.center.lng = lng
				this.center.lat = lat
				this.zoom = e.target.getZoom()
				console.log(this.center.lng, ',' + this.center.lat)
			},
			searchcomplete(point) {
				console.log(point)
			},
			/***
			* 确认
			*/
			confirm: function () {
				this.showMapComponent = false;
				let c = deepClone(this.center)
				this.$emit('confirm', c);
			},
			/***
			* 取消
			*/
			cancel: function () {
				this.showMapComponent = false
				this.$emit('cancel', this.showMapComponent)
			}
		}
    }
</script>

<style scoped>
.serachinput{
	width: 300px;
	box-sizing: border-box;
	padding: 9px;
	border: 1px solid #dddee1;
	line-height: 20px;
	font-size: 16px;
	height: 38px;
	color: #333;
	position: relative;
	border-radius: 4px;
	-webkit-box-shadow: #666 0px 0px 10px;
	-moz-box-shadow: #666 0px 0px 10px;
	box-shadow: #666 0px 0px 10px;
}
</style>