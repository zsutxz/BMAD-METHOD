# User-Defined Preferred Patterns and Preferences

Handlers deal with request and response logic only, pass everything to and from a business layer.
Hex architecture

Wrap External APIs in Facades
Wrap 3rd party libraries in Facades and use factory pattern when there could be multiple choices to use for a similar type of thing.

Mock the facade when unit testing a file that uses it.
Unit test the facade itself with the real library do not mock it - but beware of non determinism that will need to be accounted for with some libraries such as date libraries.
Use common sense with what should or should not be behind a facade.
for facades around APIs - intercept requests and mock responses for unit tests.

use RTL for react testing

if building ui with Next JS, host in vercel and favor starting projects with https://vercel.com/templates/next.js/supabase

Tailwind and Shadcn are good choices for UI.

80% unit test coverage.
