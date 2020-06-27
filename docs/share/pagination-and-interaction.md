# 基于elementUI的前端分页

## 业务场景

选择课程之后，可以通过选择自定义的优惠活动来为该课程减免优惠

## 需求

1. 由于优惠活动并不多，后端会返回全部的优惠活动，由前端实现分页，每页5条数据
2. 要求，点击 `选择优惠活动` 按钮，调用后台接口，重新获取一下优惠活动，保证优惠活动的时效性
3. 已经选择的优惠活动，不能重复选择，实现效果：选择优惠活动列表中一个优惠活动之后，优惠活动列表中就动态的减少该活动
4. 已选择的优惠活动可以删除，删除完了之后，优惠活动中改活动要动态的添加进来
5. 最多可以选择5个活动

## 实现

页面：

```vue
<template>
  <div class="home">
    <div style="text-align: left;margin: 20px">
      <el-button @click="handleClick" v-if="chooseList.length<5">选择优惠活动</el-button>
    </div>
    <el-table :data="chooseList" border :header-cell-style="headerCellStyle" style="width: 100%">
      <el-table-column prop="title" label="名称" min-width="150" align="center"></el-table-column>
      <el-table-column label="内容" prop="value" min-width="150" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-list :dataList="dataList" @chooseData="chooseData"></dialog-list>
  </div>
</template>

<script src="./index.js"></script>
<style>
  .home {
    width: 700px;
  }
</style>
```

js文件

```js
import { getData } from '@/api/index'
import dialogList from '@/components/dialog-list/index.vue'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      dataList: [],
      chooseList: [],
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        lineHeight: '30px',
        padding: '5px 0'
      },
    }
  },
  components: {
    dialogList
  },
  created() {

  },
  methods: {
    ...mapActions(['setShow']),
    // 点击添加
    handleClick() {
      this._getData()
      this.setShow(true)
    },
    // 删除选择的list
    handleDelete(id) {
      this.chooseList.map((v, i) => {
        if (v.id === id) {
          this.chooseList.splice(i, 1)
        }
      })
    },
    // 获取list
    _getData() {
      getData().then(res => {
        let {code, rs} = res.data
        if (code === 200 && rs.length > 0) {
          // 默认this.dataList是存在
          this.dataList = rs
          if (this.chooseList.length > 0) {
            // 遍历已选择的列表
            for (let i = 0; i < this.chooseList.length; i++) {
              // 遍历数据列表
              for (let j = 0; j < this.dataList.length; j++) {
                // 过滤数据列表中的id与已选择的列表相同id的数据
                this.dataList = this.dataList.filter(v => {
                  return v.id !== this.chooseList[i].id
                })
              }
            }
          }
        }
      })
    },
    // 选择列表
    chooseData(val) {
      this.chooseList.push(val)
    }
  }
}
```

弹窗页面：

```vue
<template>
  <!--营销活动列表-->
  <el-dialog
    :visible="show"
    width="500"
    :closeOnClickModal="false"
    @close="handleClose">
    <div slot="title"><h3>优惠列表</h3></div>
    <div class="content">
      <el-table
        border
        :data="computedData"
        :header-cell-style="headerCellStyle"
        style="width: 100%">
        <el-table-column width="70" align="center" label="选中">
          <template slot-scope="scope">
            <el-radio v-model="chooseData"
                      @change="handleChoose"
                      :label="scope.row"
                      style="margin-right: -15px">&nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column min-width="120" align="center" label="名称" prop="title"></el-table-column>
        <el-table-column min-width="120" align="center" label="内容" prop="value"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px;">
        <el-pagination
          background
          :layout="layout"
          :current-page="currentPage"
          :total="dataList.length"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @prev-click="handlePrev"
          @next-click="handleNext"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirmChoose" size="small">确定</el-button>
      </span>
  </el-dialog>
</template>

<script src="./index.js"></script>
```

js文件

```js
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    dataList: {
      default() {
        return []
      }
    }
  },
  data() {
    return {
      layout: 'total,prev, pager, next',
      currentPage: 1,   // 当前页
      pageSize: 5,// 每页多少条数据

      chooseData: {}, // 当前选择
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        lineHeight: '30px',
        padding: '5px 0'
      },
    }
  },
  computed: {
    ...mapGetters(['show']),
    // 分页
    computedData() {
      return this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  methods: {
    ...mapActions(['setShow']),
    // 当前页
    handleCurrentChange(num) {
      this.currentPage = num
      this.$emit('handleCurrentChange', num)
    },
    // 上一页
    handlePrev(num) {
      this.currentPage = num
      this.$emit('handlePrev', num)
    },
    // 下一页
    handleNext(num) {
      this.currentPage = num
      this.$emit('handleNext', num)
    },
    // 关闭弹窗
    handleClose() {
      this.setShow(false)
    },
    // 选择
    handleChoose(val) {
      this.chooseData = val
    },
    // 确定选择
    handleConfirmChoose() {
      // 是否选择
      if (Object.keys(this.chooseData).length > 0) {
        this.setShow(false)
        // 将选择的到父级组件中
        this.$emit('chooseData', this.chooseData)
        // 清空选择
        this.chooseData = {}
      } else {
        this.$Message.error('请选择优惠活动')
        return
      }
    },
  }
}
```
vuex省略...

核心代码：

```js
computedData() {
    return this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
}
```


## Q&A

1. elementUI的dialog组件，使用visible属性绑定的变量位于vuex的store内，使用.sync不会正常工作
，还会报错`[Vue warn]: Computed property "xxx" was assigned to but it has no setter.`,此时需要去除 .sync 修饰符
2. 复杂业务拓展，使用的优惠券的类型的冲突，比如使用了`type === 1`就不能使用`type === 2`