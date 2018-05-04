<template>
  <div :class="`${color}-box`" style="width:100%">
    <el-table :data="tableData" border>
      <el-table-column prop="Low" label="下限">
        <template slot-scope="scope">
          <el-input @keyup.enter.native="addRow" @change="changeInputL(scope.$index,scope.row.Low)" v-model="scope.row.Low" :ref="'input'+scope.$index" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="High" label="上限">
        <template slot-scope="scope">
          <el-input @keyup.enter.native="addRow" @change="changeInputH(scope.$index,scope.row.High)" v-model="scope.row.High" placeholder="" size="mini"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import clip from '@/utils/clipboard'

export default {
  props: {
    type: { // 选择单值Tab标志
      type: String,
      default: ''
    },
    Data: {
      type: Object,
      default: () => {}
    },
    color: String // 配置字体颜色  可选['red','green']
  },
  data() {
    return {
      tableData: [
        {
          Low: '',
          High: ''
        }
      ],
      ValArr: [] // 存储每一行的值
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 获取下限值
    changeInputL(index, val) {
      if (!this.ValArr[index]) {
        const obj = {}
        obj.Low = val
        this.ValArr[index] = obj
      } else {
        this.ValArr[index].Low = val
      }
    },
    // 验证必填
    addValidate(data) {
      return data.every(item => {
        return !!item.Low && !!item.High
      })
    },
    // 添加行
    addRow() {
      if (this.ValArr.length > 0) {
        if (this.addValidate(this.ValArr)) {
          this.tableData.push({
            Low: '',
            High: ''
          })
          this.ValArr.push({})
          // 添加行后自动聚焦
          const inputRef = 'input' + (this.ValArr.length - 1)
          this.$nextTick(function() {
            this.$refs[inputRef].focus()
          })
        } else {
          this.$message.error('不能有空值，请先完善!')
        }
      } else {
        this.$message.error('不能有空值，请先完善!')
      }
    },
    // 获取上限值
    changeInputH(index, val) {
      if (!this.ValArr[index]) {
        const obj = {}
        obj.High = val
        this.ValArr[index] = obj
      } else {
        this.ValArr[index].High = val
      }
    },
    // 删除行
    deleteRow() {
      if (this.tableData.length < 2) {
        this.clear()
      } else {
        this.tableData.pop()
        this.ValArr.pop()
      }
    },
    // 清空
    clear() {
      this.tableData = [
        {
          Low: '',
          High: ''
        }
      ]
      this.ValArr = []
    },
    paste() {
      const data = JSON.parse(sessionStorage.getItem('pasteData'))
      for (let i = 0; i < data[0].length; i++) {
        const item1 = data[0][i]
        const item2 = data[1][i]
        if (this.tableData[0].Low === '' && this.tableData[0].High === '') {
          this.tableData = []
          this.ValArr = []
        }
        this.tableData.push({
          Low: item1,
          High: item2
        })
        this.ValArr.push({
          Low: item1,
          High: item2
        })
      }
    },
    copy(event) {
      let str = ''
      this.tableData.forEach(item => {
        str += item.Low + '\t' + item.High + '\n'
      })
      const STR = str.substring(0, str.length - 1)
      clip(STR, event)
    },
    // 初始化数据
    initData() {
      const Data = this.Data
      const type = this.type
      if (Data[type] && Data[type][0]) {
        const data = JSON.parse(JSON.stringify(Data[type]))
        this.ValArr = data
        this.tableData = []
        data.forEach(item => {
          const obj = {
            Low: item.Low,
            High: item.High
          }
          this.tableData.push(obj)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.green {
  width: 200px;
  .el-select-dropdown__item {
    color: #27ab31;
  }
}
.green-box .el-input__inner {
  color: #27ab31;
  font-size: 18px;
}
.red {
  width: 200px;
  .el-select-dropdown__item {
    color: #ed3345;
  }
}
.red-box .el-input__inner {
  color: #ed3345;
  font-size: 18px;
}
</style>

