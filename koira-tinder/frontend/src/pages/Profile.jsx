import DogProfile from "../features/dogs/DogProfile";
import UserProfile from "../features/user/UserProfile";

export default function Profile() {
    return (
        <div>
            <section style={{ marginBottom: 32 }}>
                <h2>Käyttäjätili</h2>
                <UserProfile />
            </section>

            <section>
                <h2>Koiraprofiili</h2>
                <DogProfile />
            </section>
        </div>
    );
}
