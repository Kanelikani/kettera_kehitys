// frontend/src/components/DogCard.jsx

function DogCard({ dog, onLike, onPass }) {
    return (
        <div style={styles.card}>
            <img
                src={dog.photo}
                alt={dog.name}
                style={styles.image}
            />

            <h2>{dog.name}</h2>

            <p>
                {dog.breed} • {dog.age} years old
            </p>

            <p>{dog.bio}</p>

            <div style={styles.buttons}>
                <button onClick={onPass}>❌ Pass</button>
                <button onClick={onLike}>❤️ Like</button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        maxWidth: "320px",
        margin: "0 auto",
    },
    image: {
        width: "100%",
        height: "200px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "1rem",
    },
    buttons: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "1rem",
    },
};

export default DogCard;
