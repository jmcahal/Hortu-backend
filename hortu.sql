\echo 'Delete and recreate hortu db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE hortu;
CREATE DATABASE hortu;
\connect hortu

\i hortu-schema.sql
\i hortu-seed.sql

\echo 'Delete and recreate hortu_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE hortu_test;
CREATE DATABASE hortu_test;
\connect hortu_test

\i hortu-schema.sql