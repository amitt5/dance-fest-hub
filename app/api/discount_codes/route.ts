import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'


// POST handler to create a new discount code
export async function POST(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ 
          cookies: () => cookieStore 
        }, {
          options: {
            db: {
              schema: 'public'
            }
          }
        })
      
      const {
        data: { session },
      } = await supabase.auth.getSession()
      console.log('session1122', session, request)
  
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
          user_id: session.user.id,
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
    const supabase = createRouteHandlerClient({ cookies })

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
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

