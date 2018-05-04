<template>
  <div :class="`${color}-box`" style="width:100%">
    <el-table :data="tableData" border>
      <el-table-column prop="slectVal" label="选择按钮" :width="100">
        <template slot-scope="scope">
          <el-select :popper-class="`${color}`" placeholder="" v-model="scope.row.slectVal" @change="changeSelect(scope.$index,scope.row.slectVal)">
            <el-option v-for="item in selectData" :key="item.description" :label="item.slectVal" :value="item.slectVal">
              <span style="float: left">{{ item.slectVal }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="val" label="单值">
        <template slot-scope="scope">
          <el-input @keyup.enter.native="addRow" @change="changeInput(scope.$index,scope.row.val)" v-model="scope.row.val" size="mini" :ref="'input'+scope.$index"></el-input>
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
      selectData: [
        {
          slectVal: '=',
          description: '单值'
        },
        {
          slectVal: '≤',
          description: '小于或等于'
        },
        {
          slectVal: '≥',
          description: '大于或等于'
        },
        {
          slectVal: '>',
          description: '大于'
        },
        {
          slectVal: '<',
          description: '小于'
        }, {
          slectVal: '≠',
          description: '不等于'
        }
      ],
      tableData: [
        {
          slectVal: '=',
          val: ''
        }
      ],
      ValArr: [{ range: '=', inputVal: '' }] // 存储每一行的值
    }
  },
  beforeMount() {
    this.initData()
  },
  methods: {
    // 获取符号
    changeSelect(index, val) {
      let num = 0
      val === '≠' ? num++ : num = 0
      if (this.type === 'selSingle' && this.ValArr.length > 1) {
        this.ValArr.forEach(item => {
          if (item.range === '≠') {
            num++
          }
        })
        if (num > 1) {
          this.$message.error('排除两个值可导致选择不正确')
          return
        } else {
          this.ValArr[index].range = val
        }
      } else {
        this.ValArr[index].range = val
      }
    },
    // 获取单值
    changeInput(index, val) {
      this.ValArr[index].inputVal = val
    },
    // 添加行
    addRow() {
      if (this.ValArr.length > 0) {
        if (this.addValidate(this.ValArr)) {
          this.tableData.push({
            slectVal: '=',
            val: ''
          })
          this.ValArr.push({ range: '=', inputVal: '' })
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
          slectVal: '=',
          val: ''
        }
      ]
      this.ValArr = [{ range: '=', inputVal: '' }]
    },
    // 验证必填
    addValidate(data) {
      return data.every(item => {
        return !!item.range && !!item.inputVal
      })
    },
    // 粘贴
    paste() {
      const data = JSON.parse(sessionStorage.getItem('pasteData'))
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (this.tableData[0].val === '') {
          this.tableData = []
          this.ValArr = []
        }
        this.tableData.push({
          slectVal: '=',
          val: item
        })
        this.ValArr.push({
          range: '=',
          inputVal: item
        })
      }
    },
    // 复制
    copy(event) {
      let str = ''
      this.tableData.forEach(item => {
        str += item.val + '\n'
      })
      const STR = str.substring(0, str.length - 1)
      clip(STR, event)
    },
    // 初始化数据
    initData() {
      const Data = this.Data
      const type = this.type
      if (Data[type]) {
        const data = JSON.parse(JSON.stringify(Data[type]))
        this.ValArr = data
        this.tableData = []
        data.forEach(item => {
          const obj = {
            slectVal: item.range,
            val: item.inputVal
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

