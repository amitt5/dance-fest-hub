import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const json = await request.json()
    const {
      name,
      startDate,
      endDate,
      city,
      country,
      website,
      description,
      posterUrl,
      facebookLink,
      instagramLink,
    } = json

    // Validate required fields
    if (!name || !startDate || !endDate || !city || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        name,
        start_date: startDate,
        end_date: endDate,
        city,
        country,
        website: website || null,
        description: description || null,
        poster_url: posterUrl || null,
        created_by: session?.user?.id || null,
        facebook_link: facebookLink || null,
        instagram_link: instagramLink || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
