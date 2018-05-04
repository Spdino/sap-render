<template>
  <div class="search-input-wrap">
    <div class="input-wrap">
      <template v-if="flag">
        <el-input v-model="inputVal" @keyup.enter.native="showSelectDialog" @blur="hideConfig" @change="clear" @focus="configIcon=true" clearable placeholder="请输入内容" @input="inputMsg">
          <template v-if="range && range !== '=' ? true : false" slot="prepend">{{range}}</template>
        </el-input>
      </template>
      <template v-else>
        <el-input v-model="Low" @keyup.enter.native="showSelectDialog" @blur="hideConfig" @focus="configIcon=true" clearable>
        </el-input>
        <span style="padding:0 10px">到</span>
        <el-input v-model="High" @keyup.enter.native="showSelectDialog" @blur="hideConfig" @focus="configIcon=true" clearable>
        </el-input>
      </template>
      <div class="serach-btn" v-show="configIcon" @click="showSelectDialog">
        <i class="el-icon-search"></i>
      </div>
    </div>
    <el-dialog title="Range" v-if="dialogTableVisible" :visible.sync="dialogTableVisible">
      <el-tabs @tab-click="tabClick">
        <div class="handle-btn-group">
          <el-button size="mini" icon="el-icon-tickets" @click="handleCopy($event)">复制</el-button>
          <el-button size="mini" icon="el-icon-circle-plus-outline" @click="operating('addRow')">插入行</el-button>
          <el-button size="mini" icon="el-icon-delete" @click="operating('deleteRow')">删除选择行</el-button>
          <el-button size="mini" icon="el-icon-document" @click="showPaste">从剪贴板粘贴</el-button>
          <el-button size="mini" icon="el-icon-circle-close-outline" @click="operating('clear')">清空</el-button>
        </div>
        <el-tab-pane label="选择单值">
          <tab-pane v-if="dialogTableVisible" ref="selSingle" color="green" :Data="Ranges" type="selSingle"></tab-pane>
        </el-tab-pane>
        <el-tab-pane label="选择范围">
          <exc-tab-pane v-if="dialogTableVisible" ref="selRange" :Data="Ranges" type="selRange" color="green"></exc-tab-pane>
        </el-tab-pane>
        <el-tab-pane label="排除单值">
          <tab-pane v-if="dialogTableVisible" ref="excSingle" :Data="Ranges" type="excSingle" color="red"></tab-pane>
        </el-tab-pane>
        <el-tab-pane label="排除范围">
          <exc-tab-pane v-if="dialogTableVisible" ref="excRange" :Data="Ranges" type="excRange" color="red"></exc-tab-pane>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      <el-dialog width="40%" title="请粘贴到此剪切板" :visible.sync="innerVisible" append-to-body>
        <textarea placeholder="请粘贴内容" type="textarea" rows="10" class="el-textarea__inner" style="min-height: 33px;" v-model="pasteData" @paste="handlePaste"></textarea>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from './tabPane.vue'
import excTabPane from './excTabPane.vue'

export default {
  name: 'searchInput',
  props: ['value', 'name', 'show'],
  components: { tabPane, excTabPane },
  data() {
    return {
      innerVisible: false,
      pasteData: '',
      High: '',
      Low: '',
      tabIndex: 0,
      inputVal: '',
      flag: true,
      range: '',
      Ranges: {},
      pushData: {},
      dialogTableVisible: false,
      configIcon: false
    }
  },
  methods: {
    clear() {
      if (this.inputVal === '') {
        this.Ranges = {}
      } else {
        if (!this.Ranges.selSingle && this.inputVal) {
          this.Ranges = {
            selSingle: [{ range: '=', inputVal: this.inputVal }]
          }
        }
      }
      this.getVal()
    },
    // 与父组件双向绑定
    inputMsg(val) {
      this.$emit('input', val)
    },
    // 显示配置对话框
    showSelectDialog() {
      this.dialogTableVisible = true
      this.tabIndex = 0
      if (this.inputVal) {
        if (this.Ranges.selSingle) {
          this.Ranges.selSingle[0].inputVal = this.inputVal
        } else {
          this.Ranges.selSingle = [{
            range: '=', inputVal: this.inputVal
          }]
        }
      }
    },
    // 隐藏配置按钮
    hideConfig() {
      setTimeout(() => {
        this.configIcon = false
      }, 300)
    },
    showPaste() {
      this.innerVisible = true
      this.pasteData = ''
    },
    // 复制
    handleCopy(event) {
      switch (parseInt(this.tabIndex)) {
        case 0:
          this.$refs.selSingle.copy(event)
          break
        case 1:
          this.$refs.selRange.copy(event)
          break
        case 2:
          this.$refs.excSingle.copy(event)
          break
        case 3:
          this.$refs.excRange.copy(event)
          break
        default:
          break
      }
    },
    // 粘贴
    handlePaste() {
      setTimeout(() => {
        if (this.pasteData.length) {
          this.innerVisible = false
          const dataArr1 = []
          const dataArr2 = []
          const dataRows = this.pasteData.split('\n')
          dataRows.forEach(item => {
            const colums = item.split('\t')
            if (colums.length > 1) {
              dataArr2.push(colums[1])
            }
            dataArr1.push(colums[0])
          })
          const dataArr = [[...dataArr1], [...dataArr2]]
          switch (parseInt(this.tabIndex)) {
            case 0:
              sessionStorage.setItem('pasteData', JSON.stringify(dataArr1))
              this.$refs.selSingle.paste()
              break
            case 2:
              sessionStorage.setItem('pasteData', JSON.stringify(dataArr1))
              this.$refs.excSingle.paste()
              break
            case 1:
              sessionStorage.setItem('pasteData', JSON.stringify(dataArr))
              this.$refs.selRange.paste()
              break
            case 3:
              sessionStorage.setItem('pasteData', JSON.stringify(dataArr))
              this.$refs.excRange.paste()
              break
            default:
              break
          }
        } else {
          this.$message.error('粘贴失败，请重试')
        }
      }, 200)
    },
    // 操作
    operating(type) {
      switch (parseInt(this.tabIndex)) {
        case 0:
          this.$refs.selSingle[type]()
          break
        case 1:
          this.$refs.selRange[type]()
          break
        case 2:
          this.$refs.excSingle[type]()
          break
        case 3:
          this.$refs.excRange[type]()
          break
        default:
          break
      }
    },
    // 点击TAB页
    tabClick(val) {
      this.tabIndex = val.index
    },
    // 取消
    cancel() {
      this.dialogTableVisible = false
    },
    // 获取选择的数据
    confirm() {
      this.Ranges = {
        selSingle: this.$refs.selSingle.ValArr,
        selRange: this.$refs.selRange.ValArr,
        excSingle: this.$refs.excSingle.ValArr,
        excRange: this.$refs.excRange.ValArr
      }
      if (this.Ranges.selSingle.length === 1 && !this.Ranges.selSingle[0].inputVal) {
        delete this.Ranges.selSingle
      }
      if (this.Ranges.excSingle.length === 1 && !this.Ranges.excSingle[0].inputVal) {
        delete this.Ranges.excSingle
      }
      if (!this.Ranges.selRange.length) {
        delete this.Ranges.selRange
      }
      if (!this.Ranges.excRange.length) {
        delete this.Ranges.excRange
      }
      if (this.Ranges.selSingle || this.Ranges.selRange || this.Ranges.excSingle || this.Ranges.excRange) {
        this.showFirstData(this.Ranges)
      } else {
        this.flag = true
        this.range = ''
        this.inputVal = ''
      }
      this.getVal()
    },
    // 显示选择的第一条数据
    showFirstData(data) {
      const Arr = []
      function setArr(index, Data) {
        const obj = {}
        if (index === 1 || index === 3) {
          if (Data) {
            obj.Low = Data.Low
            obj.High = Data.High
            Arr[index] = obj
          }
        } else {
          obj.range = Data.range
          obj.inputVal = Data.inputVal
          Arr[index] = obj
        }
      }
      for (const key in data) {
        if (key === 'selSingle') {
          setArr(0, data[key][0])
        } else if (key === 'selRange') {
          setArr(1, data[key][0])
        } else if (key === 'excSingle') {
          setArr(2, data[key][0])
        } else if (key === 'excRange') {
          setArr(3, data[key][0])
        }
      }
      if (Arr[0].inputVal) {
        this.flag = true
        this.range = Arr[0].range
        this.inputVal = Arr[0].inputVal
      } else if (Arr[1].Low) {
        this.flag = false
        this.Low = Arr[1].Low
        this.High = Arr[1].High
      } else if (Arr[2].inputVal) {
        this.flag = true
        this.range = Arr[2].range
        this.inputVal = Arr[2].inputVal
      } else if (Arr[3].Low) {
        this.flag = false
        this.Low = Arr[3].Low
        this.High = Arr[3].High
      }
    },
    // 处理数据并派发
    getVal() {
      this.dialogTableVisible = false
      const Data = this.fomateObj(this.Ranges)
      this.$emit('getData', Data, this.name)
    },
    // 格式化数据
    fomateObj(data) {
      const Arr = []
      for (const key in data) {
        for (let i = 0; i < data[key].length; i++) {
          const item = data[key][i]
          const obj = {
            name: this.name,
            sign: '',
            option: '',
            low: '',
            high: ''
          }
          if (key === 'selSingle' || key === 'selRange') {
            obj.sign = 'I'
          } else {
            obj.sign = 'E'
          }
          if (key === 'selSingle' || key === 'excSingle') {
            switch (item.range) {
              case '=':
                obj.option = 'EQ'
                obj.low = item.inputVal
                break
              case '<':
                obj.option = 'LT'
                obj.low = item.inputVal
                break
              case '>':
                obj.option = 'GT'
                obj.low = item.inputVal
                break
              case '≤':
                obj.option = 'LE'
                obj.low = item.inputVal
                break
              case '≥':
                obj.option = 'GE'
                obj.low = item.inputVal
                break
              case '≠':
                obj.option = 'NE'
                obj.low = item.inputVal
                break
              default:
                break
            }
          }
          if (key === 'selRange') {
            obj.option = 'BT'
            obj.low = item.Low
            obj.high = item.High
          }
          if (key === 'excRange') {
            obj.option = 'NB'
            obj.low = item.Low
            obj.high = item.High
          }
          Arr.push(obj)
        }
      }
      return Arr
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";

.handle-btn-group {
  background: $moduleBg;
  padding: 4px 22px;
  margin-bottom: 15px;
  .el-button {
    background: $moduleBg;
    border: none;

    &:hover {
      background: $moduleBg !important;
    }
  }
}
.input-wrap {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.serach-btn {
  height: 28px;
  width: 30px;
  line-height: 28px;
  text-align: center;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
</style>
<style lang="scss">
.search-input-wrap {
  .el-input-group__prepend {
    padding: 0 10px;
  }
  .el-dialog__body {
    padding: 0 20px 0 20px;
  }
  .el-tabs__header {
    margin: 0;
  }
}
</style>


