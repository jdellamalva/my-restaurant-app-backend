const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const connectToMongoDB = require('../config/mongo');

async function seedDatabase() {
    await connectToMongoDB();

    const users = [
        {
            email: 'jdellamalva@gmail.com',
            password: 'Asdf1234!',
            createdAt: new Date(),
            cart: [],
        },
    ];

    const restaurants = [
        {
            name: "Nicola's Napoletana Pizzeria",
            imageUrl: '/napolitano_0.jpg',
            createdAt: new Date(),
        },
        {
            name: "Gino's NYC Pizza Joint",
            imageUrl: '/ny_0.jpg',
            createdAt: new Date(),
        },
        {
            name: "Mickey's Chicago Deep Dish",
            imageUrl: '/chicago_0.jpg',
            createdAt: new Date(),
        },
        {
            name: 'Pizzeria Portuguesa',
            imageUrl: '/port_0.jpg',
            createdAt: new Date(),
        },
    ];

    const dishes = [
        { name: 'La Pizza Bianca', price: 1499, description: 'Una deliziosa pizza bianca con mozzarella e ricotta. Perfetta per gli amanti del formaggio che cercano un\'opzione più leggera.', imageUrl: '/napolitano_1.jpg', createdAt: new Date() },
        { name: 'Proscitutto con Arugula', price: 1599, description: 'Una pizza saporita con prosciutto e rucola fresca. Combina la salinità del prosciutto con il sapore pepato della rucola.', imageUrl: '/napolitano_2.jpg', createdAt: new Date() },
        { name: 'La Pizza con Patate', price: 1599, description: 'Una pizza unica con patate affettate sottili e rosmarino. Un delizioso mix di patate croccanti e rosmarino aromatico.', imageUrl: '/napolitano_3.jpg', createdAt: new Date() },
        { name: 'Italian Sausage', price: 1799, description: 'A hearty pizza topped with flavorful Italian sausage and mozzarella. Ideal for those who love a meaty and satisfying pizza.', imageUrl: '/ny_1.jpg', createdAt: new Date() },
        { name: 'Hawaiian', price: 1799, description: 'A classic Hawaiian pizza with ham and pineapple. The perfect blend of sweet and savory flavors.', imageUrl: '/ny_2.jpg', createdAt: new Date() },
        { name: 'Garden Veggie', price: 1799, description: 'A vibrant New York-style pizza loaded with fresh vegetables. A healthy choice for veggie lovers.', imageUrl: '/ny_3.jpg', createdAt: new Date() },
        { name: 'A Crosta Alta', price: 1999, description: 'Uma pizza de crosta grossa com molho de tomate rico e queijo mussarela. Coberta com uma variedade de coberturas saborosas.', imageUrl: '/port_1.jpg', createdAt: new Date() },
        { name: 'O Classico', price: 1999, description: 'Uma pizza tradicional portuguesa com chouriço, presunto e azeitonas. Sabor autêntico com ingredientes clássicos.', imageUrl: '/port_2.jpg', createdAt: new Date() },
        { name: 'Pizza Fina', price: 1999, description: 'Uma pizza de crosta fina com textura leve e crocante. Coberta com manjericão fresco e tomates.', imageUrl: '/port_3.jpg', createdAt: new Date() },
        { name: 'Hawaiian Deep Dish', price: 1999, description: 'A deep dish pizza loaded with ham, pineapple, and extra cheese. A hearty and filling option for deep dish lovers.', imageUrl: '/chicago_1.jpg', createdAt: new Date() },
        { name: 'The Meat Lovers', price: 1999, description: 'A meat lover\'s dream with pepperoni, sausage, and bacon. Packed with protein and flavor.', imageUrl: '/chicago_2.jpg', createdAt: new Date() },
        { name: 'Veggie Deep Dish', price: 1999, description: 'A deep dish pizza topped with a variety of fresh vegetables. A satisfying and nutritious choice for veggie lovers.', imageUrl: '/chicago_3.jpg', createdAt: new Date() },
    ];

    try {
        await mongoose.connection.dropCollection('counters');
        console.log('Counters collection dropped');

        await User.deleteMany({});
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
        }

        await Restaurant.deleteMany({});
        const restaurantDocs = [];

        for (const restaurant of restaurants) {
            const newRestaurant = new Restaurant(restaurant);
            await newRestaurant.save();
            restaurantDocs.push(newRestaurant);
        }

        console.log('restaurantDocs:', restaurantDocs); // Log restaurantDocs to verify structure

        const restaurantIdMap = restaurantDocs.reduce((map, restaurant) => {
            map[restaurant.name] = restaurant.restaurantId;
            return map;
        }, {});

        console.log('restaurantIdMap:', restaurantIdMap); // Log restaurantIdMap to verify mapping

        const dishesWithRestaurantIds = [
            { ...dishes[0], restaurantId: restaurantIdMap["Nicola's Napoletana Pizzeria"] },
            { ...dishes[1], restaurantId: restaurantIdMap["Nicola's Napoletana Pizzeria"] },
            { ...dishes[2], restaurantId: restaurantIdMap["Nicola's Napoletana Pizzeria"] },
            { ...dishes[3], restaurantId: restaurantIdMap["Gino's NYC Pizza Joint"] },
            { ...dishes[4], restaurantId: restaurantIdMap["Gino's NYC Pizza Joint"] },
            { ...dishes[5], restaurantId: restaurantIdMap["Gino's NYC Pizza Joint"] },
            { ...dishes[6], restaurantId: restaurantIdMap["Pizzeria Portuguesa"] },
            { ...dishes[7], restaurantId: restaurantIdMap["Pizzeria Portuguesa"] },
            { ...dishes[8], restaurantId: restaurantIdMap["Pizzeria Portuguesa"] },
            { ...dishes[9], restaurantId: restaurantIdMap["Mickey's Chicago Deep Dish"] },
            { ...dishes[10], restaurantId: restaurantIdMap["Mickey's Chicago Deep Dish"] },
            { ...dishes[11], restaurantId: restaurantIdMap["Mickey's Chicago Deep Dish"] },
        ];

        console.log('dishesWithRestaurantIds:', dishesWithRestaurantIds); // Log dishesWithRestaurantIds to verify data

        await Dish.deleteMany({});
        const dishDocs = await Dish.insertMany(dishesWithRestaurantIds);

        for (const dish of dishDocs) {
            await Restaurant.updateOne(
                { restaurantId: dish.restaurantId },
                { $push: { dishes: dish._id } }
            );
        }
        
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();