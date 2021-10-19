<template>
    <div class="index">
        <h3>工作台</h3>
        <div>
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="日期"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址">
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'IndexPage',
        props: {
            msg: String
        }
    }
</script>
<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
    }
    a {
        color: #42b983;
    }
    .index{
     position: relative;
        margin:15px;
        padding: 15px 30px;
        margin-left: 310px;
        min-height: calc(100vh - 60px);
        background: #fff;
        border-radius: 8px;
    }
    .index h3{
        font-size: 18px;
        line-height: 40px;
        color: #666;
    }

</style>
