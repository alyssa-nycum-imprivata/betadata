import React from 'react';
import './Home.css';

const Home = () => {
    const quotes = ["Climbing moves are all about feeling it, and that is something I’ve spent my whole life doing.  - Alex Honnold", "Anytime you finish a climb, there’s always the next thing you can try.  - Alex Honnold", "There’s a constant tension in climbing, and really all exploration, between pushing yourself into the unknown but trying not to push too far. The best any of us can do is to tread that line carefully.  - Alex Honnold", "I’m not thinking about anything when I’m climbing, which is part of the appeal. I’m focused on executing what’s in front of me.  - Alex Honnold", "Through climbing, I've learned to find goals and work toward them. That's just the way I love to live.  - Tommy Caldwell", "Stand at the base and look up at 3,000 feet of blankness. It just looks like there's no way you can climb it. That's what you seek as a climber. You want to find something that looks absurd and figure out how to do it.  - Tommy Caldwell", "In some ways, climbing in the clouds is comforting. You can no longer see how high off the ground you are.  - Tommy Caldwell", "My natural abilities weren't necessarily brute power and strength. They were more about the ability to endure and not give up.  - Tommy Caldwell", "That's what's so amazing about climbing - it's not just a sport. It's a lifestyle, it's a way of being creative, of connecting with yourself and with nature.  - Chris Sharma", "Climbing is an artistic, creative thing; it's about being spontaneous, traveling, seeing the world, hanging out. It's a balance of setting goals while enjoying the process, being ambitious without being too competitive.  - Chris Sharma", "One of the things that separates climbing from other sports is how independent and personal it is. With most sports, you either win or lose, but climbing is about your own personal experience.  - Chris Sharma", "Climbing is a full-body sport from your fingers to your toes, but at the same time, it's like a dance on the rock. It's about being strong and fit but also graceful and elegant and efficient on the rock.  - Chris Sharma", "Every climb is different, has its own unique set of movements and body positions. Climbing and my appreciation for nature are totally intertwined.  - Chris Sharma"];

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex]
        return randomQuote
    }

    return (
        <>
            <div className="home-div">
                <h3 className="climbing-quote">
                    {getRandomQuote()}
                </h3>
            </div>
        </>
    );
};

export default Home;