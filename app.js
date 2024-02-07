import fs from 'node:fs'
import express from 'express';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

const __dirname = import.meta.dirname;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/', (req, res) => {
    console.log(req.url);
    res.json({ message: 'Hello from the server side!', app: 'Natours' });
})

const getAllTours = (req, res) => {
    res.json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.params);

    const id = Number(req.params.id);

    const tour = tours.find(el => el.id === id);
    
    // if (id > tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Invalid ID'
        });
    }

    res.json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.json({
            status: 'success',
            data: { 
                tour: newTour
            } 
        });
    });
};

const updateTour = (req, res) => {
    if (Number(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here...'
        }
    })
};

const deleteTour = (req, res) => {
    if (Number(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
};

// app.get('/api/v1/tours', getAllTours);

// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})