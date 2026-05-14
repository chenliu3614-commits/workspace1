const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data.json');

// 读取数据
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('读取数据失败:', e);
        return { timeSlots: [], priceTable: {}, records: [] };
    }
}

// 写入数据
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('写入数据失败:', e);
        return false;
    }
}

// API: 获取所有数据
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// API: 添加记录
app.post('/api/records', (req, res) => {
    const data = readData();
    const record = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.records.push(record);
    if (writeData(data)) {
        res.json({ success: true, record });
    } else {
        res.status(500).json({ success: false, error: '保存失败' });
    }
});

// API: 删除记录
app.delete('/api/records/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    data.records = data.records.filter(r => r.id !== id);
    if (writeData(data)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: '保存失败' });
    }
});

// API: 清空所有记录
app.delete('/api/records', (req, res) => {
    const data = readData();
    data.records = [];
    if (writeData(data)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: '保存失败' });
    }
});

// API: 更新价格表
app.put('/api/prices', (req, res) => {
    const data = readData();
    data.priceTable = req.body;
    if (writeData(data)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: '保存失败' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
