const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function test() {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', 'Admin');
    
    console.log("Admin (Capitalized) Count:", data ? data.length : 0);
    console.log("Error:", error);
}

test();
