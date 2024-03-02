const Hotel = require('../models/Hotels');
const Room = require('../models/Room');



// ADDING HOTELS
const createHotels = async (req, res, next) => {
    try {
        const hotel = await Hotel(req.body)
        const savedHotels = await hotel.save()
        res.status(200).json(savedHotels)
        console.log(res)
    } catch (err) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1) {
            // Duplicate key error (name already exists)
            res.status(400).json({ error: 'Hotel with this name already exists.' });
        } else {
            // Other errors
            next(error);
        }
    }
};
// UPDATE HOTELS
const updateHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }

        )
        res.status(200).json(hotels)
        console.log(res)
    } catch (err) {
        next(err)
        console.log(err)
    }
};
// DELETE HOTELS
const deleteHotels = async (req, res, next) => {
    try {
        const hotelsdelete = await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json(hotelsdelete)
    } catch (err) {
        next(err)
    }
};

// GET HOTELS BY ID
const getHotelsbyId = async (req, res, next) => {
    try {
        const hotels = await Hotel.findById(req.params.id)
        res.status(200).json(hotels)
    } catch (err) {
        next(err)
    }
};
// GET ALL HOTELS
const getAllHotels = async (req, res, next) => {
    // const { min, max, ...others } = req.query;
    try {
        // const hotels = await Hotel.find({
        //     ...others,
        //     cheapestPrice: { $gt: min | 1, $lt: max || 999 },
        // }).limit(req.query.limit);
        const hotels = await Hotel.find({})
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

// GET HOTELS BY CITY
const getHotelsByCity = async (req, res, next) => {

    // const keyword = req.query.search
    //     ? {
    //         $or: [
    //             { city: { $regex: req.query.search, $options: "i" } },
    //         ],
    //     }
    //     : {};

    // const hotel = await Hotel.find(keyword);
    // res.send(hotel);

    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all((cities.map(city => {
            return Hotel.countDocuments({ city: city })
        })))
        res.status(200).json(list)
        // console.log(list)
    } catch (err) {
        next(err);
    }
}

// GET HOTEL NUMBER BY CITY
const list = async (req, res, next) => {
    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all((cities.map(city => {
            return Hotel.countDocuments({ city: city })
        })))
        res.status(200).json(list)
        // console.log(list)
    } catch (err) {
        next(err);
    }
}
// GET HOTELS BY TYPE
const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cabinCount = await Hotel.countDocuments({ type: "cabin" });

        res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartments", count: apartmentCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },
        ]);
    } catch (err) {
        next(err);
    }
};

// GET HOTEL ROOM BY ID
const getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const list = await Promise.all(
            hotel.rooms.map((room) => {
                return Room.findById(room);
            })
        );
        res.status(200).json(list)
    } catch (err) {
        next(err);
        console.log(err);
    }
}
module.exports = {
    createHotels, updateHotels, deleteHotels, getHotelsbyId, getAllHotels, getHotelsByCity, countByType, list, getHotelRooms
}