const express = require('express');
const router = express.Router();
const pool = require('../db');


// get all items
router.get('/', async (req, res) =>{
    try{
        const result = await pool.query('SELECT * FROM items ORDER BY id');
        res.json(result.rows);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

// create item 
// CREATE
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// update items 
router.put('/:id', async (req, res) => {
    const {name, description} = req.body;
    const {id} = req.params;

    try{
        const result = await pool.query(
            'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        )
        res.json(result.rows[0]);

    }
    catch(err){
        res.status(500).json({error : err.message})
    }

});


// delete items 
router.delete('/:id', async (req, res) =>{
    const {id} = req.params;
    try{
        await pool.query('DELETE FROM items WHERE id = $1',
            [id]
        );
        res.json({message:'Item Deleted'});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

module.exports = router;