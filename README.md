# Secret Santa
This is a quite simple (and, at the moment, very crude) Secret Santa generator. I decided to create it after being unable to find a generator that did not require me to create an account and share everyone's email addresses with a random service.

To get started, just head over to https://vitorboschi.github.io/secret-santa/ and follow the steps:
1. Add a bunch of names (tip: if you don't need a group, you can just hit Enter after filling up the participant name). If a group is set to a participant, they will not be matched to someone in the same group (see known issues).
2. Once everyone is in there, hit the "Start Secret Santa!" button. Names should turn into links.
3. Just send the links to each participant. Once clicked, they'll display their match.

# Design Philosophy
The main thing I want to adhere to is that everything must happen client-side because I don't want this thing to have any backend.

This is great for privacy and to make sure this can remain easy to use and always available, but it does mean some features are impossible to implement (afaik. Let me know if you find a way to do so without some server-side storage):
- No way to have wishlists, as there's no shared storage
- No way to automatically send emails to participants (even though it should be possible to at least provide some aids for the user)

# Known issues/limitations
Here are some known problems I plan to handle as I find time to do so:
- When having more than one group, there's a chance people from the same group could be matched to each other
- Crap UI
