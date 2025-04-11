import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'


// POST handler to create a new discount code
export async function POST(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 401 })
        }
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // must be set securely (server only)
            {
              global: {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            }
          )
       

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()


        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

      
      const { code, description, eventId } = await request.json();
      
      if (!code || !eventId) {
        return NextResponse.json({ error: 'Code and event ID are required' }, { status: 400 });
      }
      
      const { data, error } = await supabase
        .from('discount_codes')
        .insert({
          code,
          description,
          event_id: eventId,
          user_id: user.id,
          upvotes: 0,
          downvotes: 0
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating discount code:', error);
        return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 });
      }
      
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error in POST /api/discount_codes:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } 


// GET handler to fetch discount codes for an event
export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching discount codes:', error);
      return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/discount_codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

